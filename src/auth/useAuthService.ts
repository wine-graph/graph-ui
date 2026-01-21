import {useSelector} from "@xstate/react";
import type {ActorRefFrom} from "xstate";
import {authMachine} from "./authMachine";
import type {PosToken, Role, SessionUser} from "./types";
import {deriveRole} from "./types";
import {fetchCurrentUser, updateRole as updateRoleApi} from "./authClient.ts";

type AuthService = ActorRefFrom<typeof authMachine>;

const isTokenValid = (t?: PosToken | null): boolean =>
  !!t && (t.expiry == null || t.expiry > Date.now());

const LOCAL_ROLE_KEY = "wg_local_role";

export const useAuthService = (service: AuthService) => {
  const user = useSelector(service, (s) => s.context.user);
  const posState = useSelector(service, (s) => s.context.pos);
  const attachInFlight = useSelector(service, (s) => s.context.attachInFlight === true);

  const isAuthenticated = useSelector(service, (s) => s.matches("authenticated"));
  const isLoading = useSelector(service, (s) => s.matches("loading"));
  const send = service.send;

  // Role derivation — prefer local override during onboarding, else server-derived
  const localRoleRaw = (() => {
    try {
      return sessionStorage.getItem(LOCAL_ROLE_KEY) || undefined;
    } catch {
      return undefined;
    }
  })();

  const role = isAuthenticated
    ? (localRoleRaw ? deriveRole(localRoleRaw) : deriveRole(user?.user.role.value))
    : ("visitor" as Role);

  // POS selectors
  const currentProvider = posState.provider;
  const currentPosToken = posState.token;
  const isAuthorized = isTokenValid(currentPosToken);

  // Quick role booleans
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
    login: (data: SessionUser) => send({type: "LOGGED_IN", data}),
    logout: () => send({type: "LOGGED_OUT"}),

    // Local role override (no backend call)
    setLocalRole: (nextRole: Role) => {
      if (!isAuthenticated) return;
      if (nextRole === "visitor" || nextRole === "admin") return;
      try {
        sessionStorage.setItem(LOCAL_ROLE_KEY, nextRole);
      } catch (err) {
        console.error("setLocalRole failed", err);
      }
      if (user) send({type: "LOGGED_IN", data: user});
    },

    clearLocalRole: () => {
      try {
        sessionStorage.removeItem(LOCAL_ROLE_KEY);
      } catch {
      }
      if (user) send({type: "LOGGED_IN", data: user});
    },

    // Refresh current user (skip during attach)
    fetchUser: async (): Promise<SessionUser | null> => {
      if (attachInFlight) {
        console.debug("[auth] fetchUser skipped (attachInFlight)");
        return user ?? null;
      }
      try {
        const updated = await fetchCurrentUser();
        if (updated) send({type: "LOGGED_IN", data: updated});
        return updated;
      } catch (e) {
        console.error("[auth] refreshUser failed", e);
        return null;
      }
    },

    // POS actions
    loadPos: (provider: "square" | "clover" | "shopify", merchantId: string) =>
      send({type: "POS.LOAD", provider, merchantId}),
    refreshPos: (provider: "square" | "clover" | "shopify", merchantId: string) =>
      send({type: "POS.REFRESH", provider, merchantId}),

    // Backend role update (sets both value and role_id)
    updateRole: (nextRole: Role, roleId: string) => {
      if (nextRole === "visitor" || nextRole === "admin") {
        console.warn("[role] blocked attempt to set disallowed role", {nextRole});
        return;
      }
      (async () => {
        try {
          send({type: "ROLE.ATTACH_START", role: nextRole, roleId});
          const updated = await updateRoleApi(nextRole as any, roleId);
          send({type: "LOGGED_IN", data: updated});
          try {
            sessionStorage.removeItem(LOCAL_ROLE_KEY);
          } catch {
          }
          send({type: "ROLE.ATTACH_DONE"});
        } catch (e) {
          console.error("[auth] updateRole failed", e);
          send({type: "ROLE.ATTACH_ERROR"});
        }
      })();
    },

    // Exposed values
    role,
    attachInFlight,
    isVisitor,
    isRetailer,
    isProducer,
    isEnthusiast,
    isAdmin,
    hasRole: (needle: Role | string) => role === (needle as Role),

    currentProvider,
    currentPosToken,
    isAuthorized,
    posLoading: posState.loading,
    posError: posState.error,
  };
};
