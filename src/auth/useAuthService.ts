import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import { authMachine } from "./authMachine";
import type { PosToken, Role, SessionUser } from "./types";
import { deriveRole, hasRole as hasRoleUtil } from "./types"; // ← new imports
import { fetchCurrentUser, saveRole } from "./authClient.ts";
type AuthService = ActorRefFrom<typeof authMachine>;

const isTokenValid = (t?: PosToken | null): boolean =>
  !!t && (t.expiry == null || t.expiry > Date.now());

export const useAuthService = (service: AuthService) => {
  const user = useSelector(service, (s) => s.context.user);
  const posState = useSelector(service, (s) => s.context.pos);

  const isAuthenticated = useSelector(service, (s) => s.matches("authenticated"));
  const isLoading = useSelector(service, (s) => s.matches("loading"));
  const send = service.send;

  // Role derivation — single source of truth
  const role = isAuthenticated
    ? deriveRole(user?.user.role.value)
    : "visitor" as Role;

  // POS selectors (now much simpler with flat structure)
  const currentProvider = posState.provider;
  const currentPosToken = posState.token;
  const isAuthorized = isTokenValid(currentPosToken);

  // Quick role booleans (most components need these)
  const isVisitor = role === "visitor";
  const isRetailer = role === "retailer";
  const isProducer = role === "producer";
  const isEnthusiast = role === "enthusiast";
  const isAdmin = role === "admin";

  return {
    user,
    isAuthenticated,
    isLoading,

    // Auth actions
    login: (data: SessionUser) => send({ type: "LOGGED_IN", data }),
    logout: () => send({ type: "LOGGED_OUT" }),

    // User refresh (still useful for polling/after some actions)
    fetchUser: async (): Promise<SessionUser | null> => {
      try {
        const updated = await fetchCurrentUser();
        console.debug("[auth] refreshed user from backend →", updated);
        if (updated) send({ type: "LOGGED_IN", data: updated });
        return updated;
      } catch (e) {
        console.error("[auth] refreshUser failed", e);
        return null;
      }
    },

    // POS actions
    loadPos: (provider: "square" | "clover" | "shopify", merchantId: string) =>
      send({ type: "POS.LOAD", provider, merchantId }),

    refreshPos: (provider: "square" | "clover" | "shopify", merchantId: string) =>
      send({ type: "POS.REFRESH", provider, merchantId }),

    // Role change (backend + redirect logic stays here for now)
    updateRole: (nextRole: Role) => {
      if (nextRole === "visitor" || nextRole === "admin") {
        console.warn("[role] blocked attempt to set disallowed role", { nextRole });
        return;
      }

      (async () => {
        try {
          console.info("[role] updating role →", { from: role, to: nextRole });
          const updated = await saveRole(nextRole as any); // backend expects uppercase enum
          const newRole = deriveRole(updated?.user?.role?.value);

          console.info("[role] role updated ✔", {
            from: role,
            to: newRole,
            userId: updated?.user?.id,
          });

          send({ type: "LOGGED_IN", data: updated });

          // Retailer-specific redirect
          if (newRole === "retailer") {
            const retailerId = updated?.user?.role?.id;
            if (retailerId) {
              const targetPath = `/retailer/${retailerId}/profile`;
              if (window.location.pathname !== targetPath) {
                window.location.assign(targetPath);
              }
            } else {
              console.warn(
                "[role] retailer selected but missing role.id; staying on current page"
              );
            }
          }
        } catch (e) {
          console.error("[role] update failed ✖", e);
        }
      })();
    },

    // Exposed values
    role,
    isVisitor,
    isRetailer,
    isProducer,
    isEnthusiast,
    isAdmin,

    // Flexible role check (if needed by components)
    hasRole: (needle: Role | string) => hasRoleUtil(user, needle as Role),

    // POS info (single-provider world)
    currentProvider,
    currentPosToken,
    isAuthorized,                // ← most useful flag for "can I use POS features?"
    posLoading: posState.loading,
    posError: posState.error,
  };
};