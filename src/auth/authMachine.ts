import {type ActorRefFrom, assign, fromPromise, setup} from "xstate";
import {fetchCurrentUser, getPosToken, refreshPosToken} from "./authClient";
import {storage} from "./storage";
import type {PosProvider, PosToken, GraphUser, Role} from "./types";
import {deriveRole} from "./types";

const ONBOARDING_ROLE_KEY = "wg_onboarding_role";

interface PosInput {
  provider: PosProvider;
  merchantId: string;
}

type PosResult = { provider: PosProvider; token: PosToken | null };

function toMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Unknown POS error";
}

export type AuthMachineActor = ActorRefFrom<typeof authMachine>;

export const authMachine = setup({
  types: {
    context: {} as {
      user: GraphUser | null;
      pos: {
        provider: PosProvider | null;
        token: PosToken | null;
        loading: boolean;
        error: string | null;
      };
      isFetchingUser: boolean;
      onboardingRole: Role | null;
    },
    events: {} as
      | { type: "LOGGED_IN"; data: GraphUser }
      | { type: "LOGGED_OUT" }
      | { type: "POS.LOAD"; provider: PosProvider; merchantId: string }
      | { type: "POS.REFRESH"; provider: PosProvider; merchantId: string }
      | { type: "FETCH_USER" }
      | { type: "ONBOARDING.SELECT_ROLE"; role: Role }
      | { type: "ONBOARDING.CLEAR" }
  },

  actors: {
    fetchUser: fromPromise<GraphUser>(async () => {
      const user = await fetchCurrentUser();
      if (!user) throw new Error("No current user returned");
      return user;
    }),

    loadPosToken: fromPromise<PosResult, PosInput>(
      async ({input}) => {
        const data = await getPosToken(input.provider, input.merchantId);
        return {provider: input.provider, token: data ?? null};
      }
    ),

    refreshPosToken: fromPromise<PosResult, PosInput>(
      async ({input}) => {
        const data = await refreshPosToken(input.provider, input.merchantId);
        return {provider: input.provider, token: data ?? null};
      }
    )
  },

  actions: {
    hydrateSessionFromStorage: assign({
      user: () => storage.getOnboardingUser(),
      onboardingRole: () => {
        const storedRole = sessionStorage.getItem(ONBOARDING_ROLE_KEY);
        return deriveRole(storedRole);
      }
    }),

    saveUser: assign({
      user: ({event, context}) => {
        if (event.type !== "LOGGED_IN") return context.user;

        const incoming = event.data as GraphUser;
        storage.saveTokenFromUser(incoming);
        if (deriveRole(incoming.role?.value)) {
          storage.clearOnboardingUser();
        } else {
          storage.saveOnboardingUser(incoming);
        }
        return incoming;
      },
      onboardingRole: ({event, context}) => {
        if (event.type !== "LOGGED_IN") return context.onboardingRole;
        if (!deriveRole(event.data.role?.value)) return context.onboardingRole;
        sessionStorage.removeItem(ONBOARDING_ROLE_KEY);
        return null;
      }
    }),

    saveFetchedUser: assign({
      user: ({event, context}) => {
        const incoming = "output" in event ? event.output as GraphUser | undefined : undefined;
        if (!incoming) return context.user;

        storage.saveTokenFromUser(incoming);
        if (deriveRole(incoming.role?.value)) {
          storage.clearOnboardingUser();
        } else {
          storage.saveOnboardingUser(incoming);
        }
        return incoming;
      },
      onboardingRole: ({event, context}) => {
        const incoming = "output" in event ? event.output as GraphUser | undefined : undefined;
        if (!deriveRole(incoming?.role?.value)) return context.onboardingRole;
        sessionStorage.removeItem(ONBOARDING_ROLE_KEY);
        return null;
      }
    }),

    clearUser: assign({
      user: () => {
        storage.clear();
        sessionStorage.removeItem(ONBOARDING_ROLE_KEY);
        return null;
      },
      pos: () => ({provider: null, token: null, loading: false, error: null}),
      isFetchingUser: () => false,
      onboardingRole: () => null
    }),

    selectOnboardingRole: assign({
      onboardingRole: ({event, context}) => {
        if (event.type !== "ONBOARDING.SELECT_ROLE") return context.onboardingRole;
        sessionStorage.setItem(ONBOARDING_ROLE_KEY, event.role);
        return event.role;
      }
    }),

    clearOnboardingRole: assign({
      onboardingRole: () => {
        sessionStorage.removeItem(ONBOARDING_ROLE_KEY);
        return null;
      }
    }),

    setFetchingUser: assign({isFetchingUser: () => true}),
    clearFetchingUser: assign({isFetchingUser: () => false}),

    setPosLoading: assign({
      pos: ({context}) => ({...context.pos, loading: true, error: null})
    }),

    setPosSuccess: assign({
      pos: ({context, event}) => {
        const output = "output" in event ? (event.output as PosResult | undefined) : undefined;

        if (!output?.token) {
          console.warn("[POS] No valid token/status returned");
          return {
            ...context.pos,
            provider: output?.provider ?? context.pos.provider,
            loading: false,
            error: null,
          };
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
        error: "error" in event ? toMessage(event.error) : "Unknown POS error"
      })
    })
  },

  guards: {
    hasUser: ({context}) => !!context.user,
    hasToken: () => !!storage.getToken(),
    hasOnboardingUser: ({context}) => !!context.user && !storage.getToken(),

    shouldRehydratePos: ({context}) => {
      const isRetailer = deriveRole(context.user?.role?.value) === "retailer";
      const hasSystem = !!context.user?.role?.system;
      const hasId = !!context.user?.role?.id;
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
    onboardingRole: null,
  },

  states: {
    initializing: {
      entry: "hydrateSessionFromStorage",
      always: [
        {target: "authenticated.loadingUser", guard: "hasToken"},
        {target: "authenticated", guard: "hasOnboardingUser"},
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
        LOGGED_OUT: {target: "unauthenticated", actions: "clearUser"},
        "ONBOARDING.SELECT_ROLE": {actions: "selectOnboardingRole"},
        "ONBOARDING.CLEAR": {actions: "clearOnboardingRole"}
      },

      states: {
        checkingPos: {
          always: [
            {
              guard: "shouldRehydratePos",
              target: "loadingPos",
              actions: "setPosLoading"
            },
            {target: "idle"}
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
              target: "checkingPos",
              actions: [
                "saveFetchedUser",
                "clearFetchingUser"
              ]
            },
            onError: [
              {
                guard: "hasUser",
                target: "idle",
                actions: [
                  ({event}) => console.error("[auth] fetch failed", event.error),
                  "clearFetchingUser"
                ]
              },
              {
                target: "#auth.unauthenticated",
                actions: [
                  ({event}) => console.error("[auth] session restore failed", event.error),
                  "clearFetchingUser",
                  "clearUser"
                ]
              }
            ]
          }
        },

        loadingPos: {
          invoke: {
            src: "loadPosToken",
            input: ({context, event}) => {
              if (event.type === "POS.LOAD" || event.type === "POS.REFRESH") {
                return {provider: event.provider, merchantId: event.merchantId};
              }
              const system = context.user?.role?.system?.toLowerCase() as PosProvider | undefined;
              const rid = context.user?.role?.id;
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
