import {useSelector} from "@xstate/react";
import type {ActorRefFrom} from "xstate";
import {authMachine} from "./authMachine";
import type {Role, SessionUser} from "./types";
import {fetchCurrentUser, saveRole} from "./authClient.ts";

type AuthService = ActorRefFrom<typeof authMachine>;

export const useAuthService = (service: AuthService) => {
  const user = useSelector(service, (s) => s.context.user);
  const pos = useSelector(service, (s) => s.context.pos);
  const isAuthenticated = useSelector(service, (s) => s.matches("authenticated"));
  const isLoading = useSelector(service, (s) => s.matches("loading"));
  const send = service.send;

  const role: Role = (() => {
    if (!isAuthenticated) return "visitor";
    const r = (user?.user.role.value ?? "").toLowerCase();
    if (r.includes("admin")) return "admin";
    if (r.includes("retailer")) return "retailer";
    if (r.includes("producer")) return "producer";
    if (r.includes("enthusiast")) return "enthusiast";
    return "visitor";
  })();

  const hasRole = (needle: string) =>
    role === needle.toLowerCase() ||
    (user?.user.role.value ?? "").toLowerCase().includes(needle.toLowerCase());

  return {
    user,
    pos,
    isAuthenticated,
    isLoading,
    login: (data: SessionUser) => send({type: "LOGGED_IN", data}),
    logout: () => send({type: "LOGGED_OUT"}),
    fetchUser: async (): Promise<SessionUser | null> => {
      try {
        const updated = await fetchCurrentUser();
        console.debug("[auth] refreshed user from backend →", updated);
        if (updated) send({type: "LOGGED_IN", data: updated});
        return updated;
      } catch (e) {
        console.error("[auth] refreshUser failed", e);
        return null;
      }
    },
    loadPos: async (provider: "square" | "clover", merchantId: string): Promise<void> => {
      send({type: "POS.LOAD", provider, merchantId});
    },
    refreshPos: async (provider: "square" | "clover", merchantId: string): Promise<void> => {
      send({type: "POS.REFRESH", provider, merchantId});
    },
    updateRole: (nextRole: Role) => {
      // Disallow setting non-selectable roles from UI
      if (nextRole === "visitor" || nextRole === "admin") {
        console.warn("[role] blocked attempt to set disallowed role", { nextRole });
        return;
      }
      // Persist to backend and rehydrate session user
      (async () => {
        try {
          console.info("[role] updating role →", { from: role, to: nextRole });
          const updated = await saveRole(nextRole as any);
          const newRole = (updated?.user?.role?.value ?? "visitor") as Role;
          console.info("[role] role updated ✔", { from: role, to: newRole, userId: updated?.user?.id });
          send({type: "LOGGED_IN", data: updated});

          // After a successful role change, redirect to role-specific profile when applicable
          const normalized = String(newRole).toLowerCase() as Role;
          if (normalized === "retailer") {
            const retailerId = updated?.user?.role?.id;
            if (retailerId) {
              const targetPath = `/retailer/${retailerId}/profile`;
              if (window.location.pathname !== targetPath) {
                window.location.assign(targetPath);
              }
            } else {
              console.warn("[role] retailer selected but missing role.id; staying on current page");
            }
          }
        } catch (e) {
          console.error("[role] update failed ✖", e);
        }
      })();
    },
    role,
    isVisitor: role === "visitor",
    isRetailer: role === "retailer",
    isProducer: role === "producer",
    isEnthusiast: role === "enthusiast",
    isAdmin: role === "admin",
    hasRole,
  };
};