import {useSelector} from "@xstate/react";
import type {PosProvider, Role, SessionUser} from "./types";
import {deriveRole} from "./types";
import type {AuthMachineActor} from "./authMachine.ts";

const LOCAL_ROLE_KEY = "wg_local_role";

export const useAuthService = (actor: AuthMachineActor) => {
  const {user, pos: posState, isAuthenticated, isFetchingUser, isInitializing, isLoading} = useSelector(actor, (s) => ({
    user: s.context.user,
    pos: s.context.pos,
    isAuthenticated: s.matches("authenticated"),
    isFetchingUser: s.context.isFetchingUser ?? false,
    isInitializing: s.matches("initializing"),
    isLoading: s.context.isFetchingUser || s.context.pos.loading
  }));

  const role: Role = (() => {
    if (!isAuthenticated) return "visitor" as Role;
    const local = sessionStorage.getItem(LOCAL_ROLE_KEY);
    return local ? deriveRole(local) : deriveRole(user?.user.role.value);
  })();

  const fetchUser = () =>
    new Promise<SessionUser>((resolve, reject) => {
      const sub = actor.subscribe((state) => {
        if (!state.context.isFetchingUser) {
          sub.unsubscribe();
          if (state.context.user) {
            resolve(state.context.user);
          } else {
            reject(new Error("Failed to load user session"));
          }
        }
      });
      actor.send({type: "FETCH_USER"});
    });

  return {
    user,
    role,
    isAuthenticated,
    isFetchingUser,
    fetchUser,
    isInitializing,
    isLoading,

    login: (data: SessionUser) => actor.send({type: "LOGGED_IN", data}),
    logout: () => actor.send({type: "LOGGED_OUT"}),

    setLocalRole: (nextRole: Role) => {
      if (!isAuthenticated || nextRole === "visitor" || nextRole === "admin") return;
      try {
        sessionStorage.setItem(LOCAL_ROLE_KEY, nextRole);
        if (user) actor.send({type: "LOGGED_IN", data: user}); // force re-render
      } catch (err) {
        console.error("setLocalRole failed", err);
      }
    },

    clearLocalRole: () => {
      try {
        sessionStorage.removeItem(LOCAL_ROLE_KEY);
      } catch {
        console.warn("Failed to clear local role");
      }
    },

    pos: {
      provider: posState.provider,
      token: posState.token,
      loading: posState.loading,
      error: posState.error,
      isAuthorized: !!posState.token && posState.token.expiresAtMs > Date.now(),

      load: (provider: PosProvider, merchantId: string) => {
        console.debug("[auth pos] explicit LOAD requested", { provider, merchantId });
        actor.send({type: "POS.LOAD", provider, merchantId})
      },

      refresh: (provider: PosProvider, merchantId: string) => {
        console.debug("[auth pos] explicit REFRESH requested", { provider, merchantId });
        actor.send({type: "POS.REFRESH", provider, merchantId})
      }
    },

    isRetailer: role === "retailer",
    isProducer: role === "producer",
    isAdmin: role === "admin",
  };
};