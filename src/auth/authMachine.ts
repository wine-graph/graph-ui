import {type ActorRefFrom, assign, fromPromise, setup} from "xstate";
import {fetchCurrentUser, getPosToken, refreshPosToken} from "./authClient";
import {storage} from "./storage";
import type {PosProvider, PosToken, SessionUser} from "./types";
import {deriveRole} from "./types";

interface PosInput {
  provider: PosProvider;
  merchantId: string;
}

export type AuthMachineActor = ActorRefFrom<typeof authMachine>;

export const authMachine = setup({
  types: {
    context: {} as {
      user: SessionUser | null;
      pos: {
        provider: PosProvider | null;
        token: PosToken | null;
        loading: boolean;
        error: string | null;
      };
      isFetchingUser: boolean;
    },
    events: {} as
      | { type: "LOGGED_IN"; data: SessionUser }
      | { type: "LOGGED_OUT" }
      | { type: "POS.LOAD"; provider: PosProvider; merchantId: string }
      | { type: "POS.REFRESH"; provider: PosProvider; merchantId: string }
      | { type: "FETCH_USER" }
  },

  actors: {
    fetchUser: fromPromise<SessionUser>(async () => {
      const user = await fetchCurrentUser();
      if (!user) throw new Error("No current user returned");
      return user;
    }),

    loadPosToken: fromPromise<{ provider: PosProvider; token: PosToken | null }, PosInput>(
      async ({input}) => {
        const data = await getPosToken(input.provider, input.merchantId);
        return {provider: input.provider, token: data ?? null};
      }
    ),

    refreshPosToken: fromPromise<{ provider: PosProvider; token: PosToken | null }, PosInput>(
      async ({input}) => {
        const data = await refreshPosToken(input.provider, input.merchantId);
        return {provider: input.provider, token: data ?? null};
      }
    )
  },

  actions: {
    hydrateUserFromStorage: assign({
      user: () => storage.getUser()
    }),

    saveUser: assign({
      user: ({event, context}) => {
        if (event.type !== "LOGGED_IN") return context.user;

        const incoming = event.data as SessionUser;
        storage.setUser(incoming);
        return incoming;
      },
    }),

    clearUser: assign({
      user: () => {
        storage.clear();
        return null;
      },
      pos: () => ({provider: null, token: null, loading: false, error: null})
    }),

    setFetchingUser: assign({isFetchingUser: () => true}),
    clearFetchingUser: assign({isFetchingUser: () => false}),

    setPosLoading: assign({
      pos: ({context}) => ({...context.pos, loading: true, error: null})
    }),

    setPosSuccess: assign({
      pos: ({context, event}) => {
        const output = (event as any).output as
          | { provider: PosProvider; token: PosToken | null }
          | undefined;

        if (!output?.token) {
          console.warn("[POS] No valid token/status returned");
          return context.pos;
        }

        return {
          provider: output.provider,
          token: output.token,
          loading: false,
          error: null,
        };
      },
    }),

    setPosError: assign({
      pos: ({context, event}) => ({
        ...context.pos,
        loading: false,
        error: (event as any)?.message ?? "Unknown POS error"
      })
    })
  },

  guards: {
    hasUser: ({context}) => !!context.user,

    shouldRehydratePos: ({context}) => {
      const isRetailer = deriveRole(context.user?.user.role?.value) === "retailer";
      const hasSystem = !!(context.user?.user.role as any)?.system;
      const hasId = !!context.user?.user.role?.id;
      const noToken = !context.pos.token;

      return isRetailer && hasSystem && hasId && noToken;
    },

    hasPosInput: ({event}) => {
      return (event.type === "POS.LOAD" || event.type === "POS.REFRESH") &&
        !!event.provider && !!event.merchantId
    }

  }
}).createMachine({
  id: "auth",
  initial: "initializing",

  context: {
    user: null,
    pos: {provider: null, token: null, loading: false, error: null},
    isFetchingUser: false,
  },

  states: {
    initializing: {
      entry: "hydrateUserFromStorage",
      always: [
        {target: "authenticated", guard: "hasUser"},
        {target: "unauthenticated"}
      ]
    },

    unauthenticated: {
      on: {
        LOGGED_IN: {target: "authenticated", actions: "saveUser"}
      }
    },

    authenticated: {
      initial: "checkingPos",
      on: {
        LOGGED_IN: {actions: "saveUser"},
        FETCH_USER: {target: ".loadingUser"},
        LOGGED_OUT: {target: "unauthenticated", actions: "clearUser"}
      },

      states: {
        checkingPos: {
          always: [
            {
              guard: "shouldRehydratePos",
              target: "loadingPos",
              actions: "setPosLoading"
            }
          ]
        },

        idle: {
          on: {
            "POS.LOAD": {
              target: "loadingPos",
              actions: "setPosLoading",
              guard: "hasPosInput"
            },
            "POS.REFRESH": {
              target: "refreshingPos",
              actions: "setPosLoading",
              guard: "hasPosInput"
            }
          }
        },

        loadingUser: {
          entry: "setFetchingUser",
          invoke: {
            src: "fetchUser",
            onDone: {
              target: "idle",
              actions: [
                assign({user: ({event}) => event.output}),
                "clearFetchingUser"
              ]
            },
            onError: {
              target: "idle",
              actions: [
                ({event}) => console.error("[auth] fetch failed", event.error),
                "clearFetchingUser"
              ]
            }
          }
        },

        loadingPos: {
          invoke: {
            src: "loadPosToken",
            input: ({context, event}) => {
              if (event.type === "POS.LOAD" || event.type === "POS.REFRESH") {
                return {provider: event.provider, merchantId: event.merchantId};
              }
              const system = (context.user?.user.role as any)?.system?.toLowerCase() as PosProvider | undefined;
              const rid = context.user?.user.role?.id;
              if (system && rid) return {provider: system, merchantId: rid};
              throw new Error("No POS input available");
            },
            onDone: {target: "idle", actions: "setPosSuccess"},
            onError: {target: "idle", actions: "setPosError"}
          }
        },

        refreshingPos: {
          invoke: {
            src: "refreshPosToken",
            input: ({event}) => {
              if (event.type !== "POS.REFRESH") throw new Error("Invalid event");
              return {provider: event.provider, merchantId: event.merchantId};
            },
            onDone: {target: "idle", actions: "setPosSuccess"},
            onError: {target: "idle", actions: "setPosError"}
          }
        }
      }
    }
  }
});