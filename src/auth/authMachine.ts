import {assign, fromPromise, setup} from "xstate";
import {getPosToken, refreshPosToken} from "./authClient";
import {storage} from "./storage";
import type {PosToken, SessionUser} from "./types";

type PosProvider = "square" | "clover";

interface PosInput {
  provider: PosProvider;
  merchantId: string;
}

/**
 * authMachine responsibilities:
 * - Hydrate user from localStorage on boot
 * - Hold current SessionUser in context.user
 * - Hold POS status in context.pos (square/clover, loading, error)
 * - React to:
 *    - LOGGED_IN: set user + persist
 *    - LOGGED_OUT: clear user + POS
 *    - POS.LOAD/POS.REFRESH: load POS token from backend
 */
export const authMachine = setup({
  types: {
    context: {} as {
      user: SessionUser | null;
      pos: {
        square: PosToken | null;
        clover: PosToken | null;
        loading: boolean;
        error: string | null;
      };
    },
    events: {} as
      | { type: "LOGGED_IN"; data: SessionUser }
      | { type: "LOGGED_OUT" }
      | { type: "POS.LOAD"; provider: PosProvider; merchantId: string }
      | { type: "POS.REFRESH"; provider: PosProvider; merchantId: string },
  },
  actors: {

    loadPosToken: fromPromise<PosToken | null, PosInput>(async ({input}) => {
      const data = await getPosToken(input.provider, input.merchantId);
      console.debug("[auth] POS token loaded for:", input.merchantId);
      return data ?? null;
    }),

    refreshPosToken: fromPromise<PosToken | null, PosInput>(async ({input}) => {
      const data = await refreshPosToken(input.provider, input.merchantId);
      console.debug("[auth] POS token refreshed for:", input.merchantId);
      return data ?? null;
    }),
  },

  actions: {
    // Boot: hydrate user from localStorage only
    hydrateUserFromStorage: assign({
      user: () => {
        const u = storage.getUser();
        console.debug("[auth] user hydrated from storage →", u?.user.id);
        return u;
      },
    }),

    // Save user from events / invokes, but DON'T clobber context.user when payload is empty
    saveUser: assign({
      user: ({context, event}) => {
        const e: any = event ?? {};
        const payload = e?.data ?? e?.output ?? null;

        if (payload) {
          const user = payload as SessionUser;
          storage.setUser(user);
          return user;
        }

        // No payload (e.g. entry into authenticated): keep existing user
        return context.user;
      },
    }),

    clearUser: assign({
      user: () => {
        console.debug("[auth] clearUser called");
        storage.clear();
        return null;
      },
      pos: () => ({
        square: null,
        clover: null,
        loading: false,
        error: null,
      }),
    }),

    setPosLoading: assign({
      pos: ({context}) => ({
        ...context.pos,
        loading: true,
        error: null,
      }),
    }),

    // POS success after load/refresh – robust against event being undefined
    setPosFromOutput: assign({
      pos: ({context, event}) => {
        const e: any = event ?? {};
        const output = (e.output as PosToken | null) ?? null;

        console.log("[auth] setPosFromOutput → before:", context.pos);
        console.log("[auth] setPosFromOutput → output:", output);

        const next = {
          square: output,             // set Square explicitly
          clover: context.pos.clover, // keep clover as-is for now
          loading: false,
          error: null,
        };

        console.log("[auth] setPosFromOutput → after:", next);
        return next;
      },
    }),

    // POS error handler – robust against event being undefined
    setPosError: assign({
      pos: ({context, event}) => {
        const e: any = event ?? {};
        const err =
          (e.error as Error | undefined)?.message ??
          String(e.error ?? "Unknown POS error");

        console.error("[auth] setPosError:", err);

        return {
          ...context.pos,
          square: null,
          loading: false,
          error: err,
        };
      },
    }),
  },

  guards: {
    hasUserInContext: ({context}) => context.user != null,
    isRetailer: ({context}) => context.user?.user.role.value === 'retailer',
    isRetailerEvent: ({context, event}) => {
      const e = event as { data?: SessionUser };
      const next = e.data ?? context.user;
      if (!next) return false;
      return next.user.role.value === 'retailer';
    }
  },
}).createMachine({
  id: "auth",
  initial: "loading",
  context: {
    user: null,
    pos: {
      square: null,
      clover: null,
      loading: false,
      error: null,
    },
  },

  states: {
    // Boot: hydrate user from storage, no network calls
    loading: {
      entry: "hydrateUserFromStorage",
      always: [
        {
          target: "authenticated.loadingPos",
          guard: "isRetailer"
        },
        {
          target: "authenticated",
          guard: "hasUserInContext",
        },
        {
          target: "unauthenticated",
        },
      ],
    },

    unauthenticated: {
      // don't clear storage on just being unauth'd
      on: {
        LOGGED_IN: [
          {
            guard: "isRetailerEvent",
            target: "authenticated.loadingPos",
            actions: "saveUser"
          },
          {
            target: "authenticated",
            actions: "saveUser"
          }
        ]
      },
    },

    authenticated: {
      entry: "saveUser",
      initial: "idle",
      on: {
        LOGGED_OUT: {
          target: "unauthenticated",
          actions: "clearUser",
        },
        LOGGED_IN: {
          actions: "saveUser"
        }
      },
      // Nested state for authenticated
      states: {

        idle: {
          on: {
            "POS.LOAD": {
              actions: "setPosLoading",
              target: "loadingPos",
            },
            "POS.REFRESH": {
              actions: "setPosLoading",
              target: "refreshingPos",
            },
          },
        },

        loadingPos: {
          invoke: {
            src: "loadPosToken",
            input: ({context, event}) => {
              // If called from an explicit POS.LOAD event, use that
              const maybeEvent = event as { provider?: PosProvider; merchantId?: string };
              if (maybeEvent.provider && maybeEvent.merchantId) {
                return {
                  provider: maybeEvent.provider,
                  merchantId: maybeEvent.merchantId,
                };
              }

              // Auto-load on boot: use user role id as merchantId
              const user = context.user?.user;
              if (!user) {
                throw new Error("No user in context when loading POS");
              }

              const merchantId = user.role.id; // <- role id as merchantId

              // Choose your provider here (or derive from user if you store it)
              // todo make this dynamic based on the PosProvider values
              const provider: PosProvider = "square";

              return {provider, merchantId};
            },
            onDone: {
              target: "idle",
              actions: "setPosFromOutput",
            },
            onError: {
              target: "idle",
              actions: "setPosError",
            },
          },
        },

        refreshingPos: {
          invoke: {
            src: "refreshPosToken",
            input: ({event}) => {
              const e = event as { provider: PosProvider; merchantId: string };
              return {
                provider: e.provider,
                merchantId: e.merchantId,
              };
            },
            onDone: {
              target: "idle",
              actions: "setPosFromOutput",
            },
            onError: {
              target: "idle",
              actions: "setPosError",
            },
          },
        },
      },
    },
  },
});