import {useSelector} from "@xstate/react";
import type {GraphUser, PosProvider, Role} from "./types";
import {deriveRole} from "./types";
import type {AuthMachineActor} from "./authMachine.ts";

export const useAuthService = (actor: AuthMachineActor) => {
  const {user, pos: posState, onboardingRole, isAuthenticated, isFetchingUser, isInitializing, isLoading} = useSelector(actor, (s) => ({
    user: s.context.user,
    pos: s.context.pos,
    onboardingRole: s.context.onboardingRole,
    isAuthenticated: s.matches("authenticated"),
    isFetchingUser: s.context.isFetchingUser ?? false,
    isInitializing: s.matches("initializing") || (s.matches({authenticated: "loadingUser"}) && !s.context.user),
    isLoading: s.context.isFetchingUser || s.context.pos.loading
  }));

  const role = isAuthenticated ? deriveRole(user?.role?.value) : null;
  const authStatus = isInitializing
    ? "initializing"
    : !isAuthenticated
      ? "unauthenticated"
      : role
        ? "authenticated_onboarded"
        : "authenticated_unonboarded";

  const fetchUser = () =>
    new Promise<GraphUser>((resolve, reject) => {
      actor.send({type: "FETCH_USER"});
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
    });

  return {
    user,
    role,
    onboardingRole,
    authStatus,
    isAuthenticated,
    isOnboarded: isAuthenticated && Boolean(role),
    isFetchingUser,
    fetchUser,
    isInitializing,
    isLoading,

    login: (data: GraphUser) => actor.send({type: "LOGGED_IN", data}),
    logout: () => actor.send({type: "LOGGED_OUT"}),

    selectOnboardingRole: (nextRole: Role) => {
      if (!isAuthenticated || nextRole === "admin") return;
      actor.send({type: "ONBOARDING.SELECT_ROLE", role: nextRole});
    },

    clearOnboardingRole: () => actor.send({type: "ONBOARDING.CLEAR"}),

    pos: {
      provider: posState.provider,
      token: posState.token,
      loading: posState.loading,
      error: posState.error,
      isAuthorized: !!posState.token && posState.token.expiresAtMs > Date.now(),

      load: (provider: PosProvider, merchantId: string) => {
        actor.send({type: "POS.LOAD", provider, merchantId})
      },

      refresh: (provider: PosProvider, merchantId: string) => {
        actor.send({type: "POS.REFRESH", provider, merchantId})
      }
    },

    isRetailer: role === "retailer",
    isProducer: role === "producer",
    isAdmin: role === "admin",
  };
};
