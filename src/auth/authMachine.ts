import {assign, fromPromise, setup} from "xstate";
import {getPosToken, refreshPosToken} from "./authClient";
import {storage} from "./storage";
import type {PosProvider, PosToken, SessionUser} from "./types";
import {deriveRole} from "./types";

interface PosInput {
  provider: PosProvider;
  merchantId: string;
}

export const authMachine = setup({
  types: {
    context: {} as {
      user: SessionUser | null;
      // When true, we are performing a backend attach of role/value+id.
      // During this window we should ignore stale LOGGED_IN updates and
      // pause side-effects like POS rehydration.
      attachInFlight?: boolean;
      pendingRoleAttach?: { role?: string; roleId?: string } | null;
      pos: {
        provider: PosProvider | null;
        token: PosToken | null;
        loading: boolean;
        error: string | null;
      };
    },
    events: {} as
      | { type: "LOGGED_IN"; data: SessionUser }
      | { type: "LOGGED_OUT" }
      | { type: "POS.LOAD"; provider: PosProvider; merchantId: string }
      | { type: "POS.REFRESH"; provider: PosProvider; merchantId: string }
      | { type: "ROLE.ATTACH_START"; role?: string; roleId?: string }
      | { type: "ROLE.ATTACH_DONE" }
      | { type: "ROLE.ATTACH_ERROR" },
  },

  actors: {
    loadPosToken: fromPromise<
      { provider: PosProvider; token: PosToken | null },
      PosInput
    >(async ({input}) => {
      const data = await getPosToken(input.provider, input.merchantId);
      console.debug("[auth] POS token loaded:", input.provider, input.merchantId);
      return {provider: input.provider, token: data ?? null};
    }),

    refreshPosToken: fromPromise<
      { provider: PosProvider; token: PosToken | null },
      PosInput
    >(async ({input}) => {
      const data = await refreshPosToken(input.provider, input.merchantId);
      console.debug("[auth] POS token refreshed:", input.provider, input.merchantId);
      return {provider: input.provider, token: data ?? null};
    }),
  },

  actions: {
    hydrateUserFromStorage: assign({
      user: () => {
        const u = storage.getUser();
        console.debug("[auth] hydrated user from storage →", u?.user.id);
        return u;
      },
    }),

    saveUser: assign({
      user: ({context, event}) => {
        const payload = (event as any)?.data ?? (event as any)?.output ?? null;
        if (!payload) return context.user;

        const incoming = payload as SessionUser;

        // If a role attach is currently in flight, ignore stale LOGGED_IN
        // updates that don't change role value or id. This avoids overwriting
        // the soon-to-be authoritative attach response with an older fetch.
        if (context.attachInFlight) {
          const prevRoleVal = context.user?.user.role?.value ?? "";
          const prevRoleId = context.user?.user.role?.id ?? "";
          const nextRoleVal = incoming?.user?.role?.value ?? "";
          const nextRoleId = incoming?.user?.role?.id ?? "";
          const roleChanged = prevRoleVal !== nextRoleVal || prevRoleId !== nextRoleId;
          if (!roleChanged) {
            console.debug("[auth] saveUser ignored (attachInFlight, no role change)");
            return context.user;
          }
        }

        try {
          const prev = deriveRole(context.user?.user.role.value);
          const next = deriveRole(incoming?.user?.role?.value);
          if (prev !== next) {
            console.info("[role] transition", {from: prev, to: next});
          }
        } catch {
          console.warn("[role] failed to derive role", incoming?.user?.role?.value);
        }
        storage.setUser(incoming);
        return incoming;
      },
    }),

    clearUser: assign({
      user: () => {
        console.debug("[auth] clearing user");
        storage.clear();
        return null;
      },
      pos: () => ({
        provider: null,
        token: null,
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

    setPosSuccess: assign({
      pos: ({context, event}) => {
        const output = (event as any).output as
          | { provider: PosProvider; token: PosToken | null }
          | undefined;
        if (!output?.token) return context.pos;

        const {provider, token} = output;

        return {
          provider,
          token,
          loading: false,
          error: null,
        };
      },
    }),

    setPosError: assign({
      pos: ({context, event}) => {
        const err = (event as any)?.error?.message ?? "Unknown POS error";
        console.error("[auth] POS error:", err);
        return {
          ...context.pos,
          loading: false,
          error: err,
        };
      },
    }),

    setAttachStart: assign({
      attachInFlight: () => true,
      pendingRoleAttach: (_ctx, ev: any) => ({role: ev?.role, roleId: ev?.roleId}),
    }),

    setAttachDone: assign({
      attachInFlight: () => false,
      pendingRoleAttach: () => null,
    }),

    setAttachError: assign({
      attachInFlight: () => false,
    }),
  },

  guards: {
    hasUser: ({context}) => !!context.user,

    shouldRehydratePos: ({context}) => {
      // Only retailers with a system provider can auto-load
      if (context.attachInFlight) return false;
      if (deriveRole(context.user?.user.role.value) !== "retailer") return false;
      // Already have a valid token loaded? Skip
      if (context.pos.token && context.pos.provider) return false;

      const system = (context.user?.user.role as any)?.system as PosProvider | null | undefined;
      const hasMerchantId = !!context.user?.user.role?.id;

      return !!system && hasMerchantId;
    },

    hasPosInput: ({event}) => {
      const e = event as any;
      return !!e?.provider && !!e?.merchantId;
    },
  },
}).createMachine({
  id: "auth",
  initial: "loading",
  context: {
    user: null,
    pos: {
      provider: null,
      token: null,
      loading: false,
      error: null,
    },
  },

  on: {
    LOGGED_OUT: {
      target: ".unauthenticated",
      actions: "clearUser",
    },
    "ROLE.ATTACH_START": {
      actions: "setAttachStart",
    },
    "ROLE.ATTACH_DONE": {
      actions: "setAttachDone",
    },
    "ROLE.ATTACH_ERROR": {
      actions: "setAttachError",
    },
  },

  states: {
    loading: {
      entry: "hydrateUserFromStorage",
      always: [
        {target: "authenticated", guard: "hasUser"},
        {target: "unauthenticated"},
      ],
    },

    unauthenticated: {
      id: "unauthenticated",
      on: {
        LOGGED_IN: {
          target: "authenticated",
          actions: "saveUser",
        },
      },
    },

    authenticated: {
      entry: "saveUser",
      initial: "idle",
      // Allow updating the stored user (e.g., role change) without leaving the
      // authenticated state. Previously, LOGGED_IN events sent while already
      // authenticated were ignored, so localStorage (graph_user) was not updated.
      on: {
        LOGGED_IN: {
          actions: "saveUser",
        },
      },

      states: {
        idle: {
          always: [
            {
              guard: "shouldRehydratePos",
              target: "loadingPos",
              actions: "setPosLoading",
            },
          ],
          on: {
            "POS.LOAD": {
              target: "loadingPos",
              actions: "setPosLoading",
              guard: "hasPosInput",
            },
            "POS.REFRESH": {
              target: "refreshingPos",
              actions: "setPosLoading",
              guard: "hasPosInput",
            },
          },
        },

        loadingPos: {
          invoke: {
            src: "loadPosToken",
            input: ({context, event}) => {
              const e = event as any;

              // Explicit call takes priority
              if (e?.provider && e?.merchantId) {
                return {provider: e.provider, merchantId: e.merchantId};
              }

              // Auto-rehydrate from role.system (backend source of truth)
              const system = (context.user?.user.role as any)?.system as PosProvider | undefined;
              const rid = context.user?.user.role?.id;
              if (system && rid) {
                return {provider: system, merchantId: rid};
              }

              throw new Error("Cannot load POS: no provider/merchantId available");
            },
            onDone: {
              target: "idle",
              actions: "setPosSuccess",
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
              const e = event as any;
              return {
                provider: e.provider,
                merchantId: e.merchantId,
              };
            },
            onDone: {
              target: "idle",
              actions: "setPosSuccess",
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