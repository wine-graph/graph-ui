import {useSelector} from "@xstate/react";
import type {PosProvider, Role, SessionUser} from "./types";
import {deriveRole} from "./types";
import {fetchCurrentUser, updateRole as updateRoleApi} from "./authClient";
import type {AuthMachineActor} from "./authMachine.ts";

const LOCAL_ROLE_KEY = "wg_local_role";

export const useAuthService = (actor: AuthMachineActor) => {
  // Use a single selector for core state to avoid multiple subscription overhead
  const {user, pos: posState, attachInFlight, isAuthenticated, isLoading} = useSelector(actor, (s) => ({
    user: s.context.user,
    pos: s.context.pos,
    attachInFlight: s.context.attachInFlight,
    isAuthenticated: s.matches("authenticated"),
    isLoading: s.matches("loading"),
  }));

  // Compute role on each render so sessionStorage override is effective immediately after setLocalRole
  const role: Role = (() => {
    if (!isAuthenticated) return "visitor" as Role;
    const local = sessionStorage.getItem(LOCAL_ROLE_KEY);
    return local ? deriveRole(local) : deriveRole(user?.user.role.value);
  })();

  return {
    user,
    isAuthenticated,
    isLoading,
    attachInFlight,

    // Actions
    login: (data: SessionUser) => actor.send({type: "LOGGED_IN", data}),
    logout: () => actor.send({type: "LOGGED_OUT"}),

    fetchUser: async () => {
      if (attachInFlight) return user;
      const updated = await fetchCurrentUser();
      if (updated) actor.send({type: "LOGGED_IN", data: updated});
      return updated;
    },

    // Local role override (no backend call)
    setLocalRole: (nextRole: Role) => {
      if (!isAuthenticated) return;
      if (nextRole === "visitor" || nextRole === "admin") return;
      try {
        sessionStorage.setItem(LOCAL_ROLE_KEY, nextRole);
      } catch (err) {
        console.error("setLocalRole failed", err);
      }
      if (user) actor.send({type: "LOGGED_IN", data: user});
    },

    updateRole: async (nextRole: Role, roleId: string) => {
      if (["visitor", "admin"].includes(nextRole)) return;
      try {
        if (import.meta.env.DEV) {
          console.info("[auth] updateRole called", { role: nextRole, roleId });
        }
        actor.send({type: "ROLE.ATTACH_START", role: nextRole, roleId});
        const updated = await updateRoleApi(nextRole as Role, roleId);
        if (import.meta.env.DEV) {
          console.info("[auth] updateRole success, updating user context", {
            newRole: updated?.user?.role,
          });
        }
        actor.send({type: "LOGGED_IN", data: updated});
        sessionStorage.removeItem(LOCAL_ROLE_KEY);
        actor.send({type: "ROLE.ATTACH_DONE"});
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error("[auth] updateRole failed", e);
        }
        actor.send({type: "ROLE.ATTACH_ERROR"});
      }
    },

    clearLocalRole: () => {
      try {
        sessionStorage.removeItem(LOCAL_ROLE_KEY);
      } catch {
        console.warn("Failed to clear local role");
      }
    },


    // Grouped Retailer/POS Object
    pos: {
      provider: posState.provider,
      token: posState.token,
      loading: posState.loading,
      error: posState.error,
      isAuthorized: !!posState.token && (!posState.token.expiry || posState.token.expiry > Date.now()),

      // Actions inside the group
      load: (provider: PosProvider, merchantId: string) =>
        actor.send({ type: "POS.LOAD", provider, merchantId }),
      refresh: (provider: PosProvider, merchantId: string) =>
        actor.send({ type: "POS.REFRESH", provider, merchantId }),
    },

    // Quick helpers
    isRetailer: role === "retailer",
    isProducer: role === "producer",
    isAdmin: role === "admin",
  };
};