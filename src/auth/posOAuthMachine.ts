import {assign, fromPromise, setup} from "xstate";
import type {PosProvider, SessionUser} from "./types";

type MachineInput = {
  fetchUser: () => Promise<SessionUser>;
  loadPos: (provider: PosProvider, merchantId: string) => void;
};

const labelFor = (provider: PosProvider): string => {
  if (provider === "square") return "Square";
  if (provider === "clover") return "Clover";
  return "Shopify";
};

const clearCallbackQueryParams = () => {
  const url = new URL(window.location.href);
  ["id", "error", "code", "state", "shop", "host", "hmac", "timestamp"].forEach((k) => url.searchParams.delete(k));
  window.history.replaceState({}, "", url.pathname + url.search);
};

export const posOAuthMachine = setup({
  types: {
    input: {} as MachineInput,
    context: {} as {
      provider: PosProvider | null;
      fetchUser: MachineInput["fetchUser"];
      loadPos: MachineInput["loadPos"];
      error: string | null;
      redirectPath: string | null;
      completedAt: number;
    },
    events: {} as
      | {type: "START"; provider: PosProvider}
      | {type: "RESET"},
  },
  actors: {
    completeOAuth: fromPromise<{retailerId: string}, {
      provider: PosProvider;
      fetchUser: MachineInput["fetchUser"];
      loadPos: MachineInput["loadPos"];
    }>(async ({input}) => {
      const {provider, fetchUser, loadPos} = input;
      const pendingKey = `${provider}_oauth_pending`;
      const providerLabel = labelFor(provider);
      const url = new URL(window.location.href);
      const merchantId = url.searchParams.get("id");
      const error = url.searchParams.get("error");

      try {
        if (error) throw new Error(`${providerLabel} denied access`);
        if (!merchantId) throw new Error("Missing merchant ID");
        loadPos(provider, merchantId);
        const updatedUser = await fetchUser();
        const retailerId = updatedUser?.user.role.id ?? merchantId;
        if (!retailerId) throw new Error("Missing retailer ID after authorization");
        return {retailerId};
      } finally {
        sessionStorage.removeItem(pendingKey);
        clearCallbackQueryParams();
      }
    }),
  },
  actions: {
    setProvider: assign({
      provider: ({event}) => event.type === "START" ? event.provider : null,
      error: () => null,
      redirectPath: () => null,
    }),
    clearState: assign({
      provider: () => null,
      error: () => null,
      redirectPath: () => null,
    }),
    handleSuccess: assign({
      error: () => null,
      completedAt: () => Date.now(),
      redirectPath: ({event}) => {
        const retailerId = (event as {output?: {retailerId?: string}}).output?.retailerId;
        return retailerId ? `/retailer/${retailerId}/profile` : "/profile";
      },
    }),
    handleFailure: assign({
      error: ({event}) => {
        const error = (event as {error?: unknown}).error;
        const message = error instanceof Error ? error.message : "POS authorization failed";
        sessionStorage.setItem("pos_oauth_error", message);
        return message;
      },
      completedAt: () => Date.now(),
      redirectPath: () => "/profile",
    }),
    clearPersistedError: () => {
      sessionStorage.removeItem("pos_oauth_error");
    },
  },
}).createMachine({
  id: "posOAuth",
  initial: "idle",
  context: ({input}) => ({
    provider: null,
    fetchUser: input.fetchUser,
    loadPos: input.loadPos,
    error: null,
    redirectPath: null,
    completedAt: 0,
  }),
  states: {
    idle: {
      on: {
        START: {
          target: "processing",
          actions: ["setProvider", "clearPersistedError"],
        },
        RESET: {
          actions: "clearState",
        },
      },
    },
    processing: {
      invoke: {
        src: "completeOAuth",
        input: ({context}) => {
          if (!context.provider) throw new Error("Missing provider");
          return {
            provider: context.provider,
            fetchUser: context.fetchUser,
            loadPos: context.loadPos,
          };
        },
        onDone: {
          target: "idle",
          actions: "handleSuccess",
        },
        onError: {
          target: "idle",
          actions: "handleFailure",
        },
      },
      on: {
        RESET: {
          target: "idle",
          actions: "clearState",
        },
      },
    },
  },
});
