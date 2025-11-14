import {useSelector} from "@xstate/react";
import type {ActorRefFrom} from "xstate";
import {authMachine} from "./authMachine";
import type {Role, SessionUser} from "./types";
import {fetchCurrentUser} from "./authClient.ts";

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
    role,
    isVisitor: role === "visitor",
    isRetailer: role === "retailer",
    isProducer: role === "producer",
    isEnthusiast: role === "enthusiast",
    isAdmin: role === "admin",
    hasRole,
  };
};