import {assign, fromPromise, setup} from "xstate";
import {retailerClient} from "../../services/apolloClient.ts";
import {RETAILER_INVENTORY_MUTATION, RETAILER_ONBOARDING_MUTATION} from "../../services/retailer/retailerGraph.ts";

export type PosEnum = "SQUARE" | "CLOVER" | "SHOPIFY";
type FlowAction = "onboard" | "sync" | null;

type OnboardInput = {
  merchantId: string;
  pos: PosEnum;
};

type SyncInput = {
  merchantId: string;
};

type FlowError = {
  message?: string;
};

const onboardingInflight = new Map<string, Promise<void>>();

const doneKeyFor = (key: string) => `retailer_onboarded::${key}`;

const hasDoneOnboarding = (key: string): boolean => {
  try {
    return localStorage.getItem(doneKeyFor(key)) === "done";
  } catch {
    return false;
  }
};

const markDoneOnboarding = (key: string) => {
  try {
    localStorage.setItem(doneKeyFor(key), "done");
  } catch {
    // Ignore storage failures and continue.
  }
};

const isDuplicateRetailerInsert = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const message = (error as {message?: unknown}).message;
  if (typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return lower.includes("duplicate key value") ||
    lower.includes("retailer_pkey") ||
    lower.includes("already exists") ||
    lower.includes("sqlstate: 23505");
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const message = (error as FlowError).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Request failed. Please try again.";
};

export const retailerFlowMachine = setup({
  types: {
    context: {} as {
      merchantId: string | null;
      pos: PosEnum | null;
      isAuthorized: boolean;
      isOnboarded: boolean;
      error: string | null;
      lastCompletedAction: FlowAction;
      completedAt: number;
      autoAttemptedKey: string | null;
    },
    events: {} as
      | {type: "SET_ENV"; merchantId: string | null; pos: PosEnum | null; isAuthorized: boolean; isOnboarded: boolean}
      | {type: "AUTO_ONBOARD"}
      | {type: "ONBOARD.REQUEST"}
      | {type: "SYNC.REQUEST"}
      | {type: "CLEAR_ERROR"},
  },
  actors: {
    onboardRetailer: fromPromise<void, OnboardInput>(async ({input}) => {
      const key = `${input.pos}::${input.merchantId}`;
      if (hasDoneOnboarding(key)) return;

      const existing = onboardingInflight.get(key);
      if (existing) {
        await existing;
        return;
      }

      const pending = (async () => {
        try {
          await retailerClient.mutate({
            mutation: RETAILER_ONBOARDING_MUTATION,
            variables: {merchantId: input.merchantId, pos: input.pos},
          });
          markDoneOnboarding(key);
        } catch (error) {
          // Parallel first-time onboarding may race into a duplicate insert.
          // Treat that as success since the retailer row already exists.
          if (isDuplicateRetailerInsert(error)) {
            markDoneOnboarding(key);
            return;
          }
          throw error;
        } finally {
          onboardingInflight.delete(key);
        }
      })();

      onboardingInflight.set(key, pending);
      await pending;
    }),
    syncInventory: fromPromise<void, SyncInput>(async ({input}) => {
      await retailerClient.mutate({
        mutation: RETAILER_INVENTORY_MUTATION,
        variables: {merchantId: input.merchantId},
      });
    }),
  },
  actions: {
    setEnv: assign({
      merchantId: ({event, context}) => event.type === "SET_ENV" ? event.merchantId : context.merchantId,
      pos: ({event, context}) => event.type === "SET_ENV" ? event.pos : context.pos,
      isAuthorized: ({event, context}) => event.type === "SET_ENV" ? event.isAuthorized : context.isAuthorized,
      isOnboarded: ({event, context}) => event.type === "SET_ENV" ? event.isOnboarded : context.isOnboarded,
      autoAttemptedKey: ({event, context}) => {
        if (event.type !== "SET_ENV") return context.autoAttemptedKey;
        const key = event.merchantId && event.pos ? `${event.pos}::${event.merchantId}` : null;
        if (!key || key === context.autoAttemptedKey) return context.autoAttemptedKey;
        return null;
      },
    }),
    markAutoAttempted: assign({
      autoAttemptedKey: ({context}) => context.merchantId && context.pos ? `${context.pos}::${context.merchantId}` : context.autoAttemptedKey,
    }),
    clearError: assign({error: () => null}),
    setError: assign({error: ({event}) => getErrorMessage((event as {error?: unknown}).error)}),
    completeOnboarding: assign({
      error: () => null,
      lastCompletedAction: () => "onboard" as FlowAction,
      completedAt: () => Date.now(),
      isOnboarded: () => true,
    }),
    completeSync: assign({
      error: () => null,
      lastCompletedAction: () => "sync" as FlowAction,
      completedAt: () => Date.now(),
    }),
  },
  guards: {
    canOnboard: ({context}) => !!context.isAuthorized && !!context.merchantId && !!context.pos,
    canSync: ({context}) => !!context.isAuthorized && !!context.merchantId && context.isOnboarded,
    shouldAutoOnboard: ({context}) => {
      if (!context.isAuthorized || !context.merchantId || !context.pos || context.isOnboarded) return false;
      const key = `${context.pos}::${context.merchantId}`;
      return key !== context.autoAttemptedKey;
    },
  },
}).createMachine({
  id: "retailerFlow",
  initial: "idle",
  context: {
    merchantId: null,
    pos: null,
    isAuthorized: false,
    isOnboarded: false,
    error: null,
    lastCompletedAction: null,
    completedAt: 0,
    autoAttemptedKey: null,
  },
  states: {
    idle: {
      on: {
        "SET_ENV": {actions: "setEnv"},
        "CLEAR_ERROR": {actions: "clearError"},
        "AUTO_ONBOARD": {
          guard: "shouldAutoOnboard",
          target: "onboarding",
          actions: "markAutoAttempted",
        },
        "ONBOARD.REQUEST": {
          guard: "canOnboard",
          target: "onboarding",
          actions: "markAutoAttempted",
        },
        "SYNC.REQUEST": {
          guard: "canSync",
          target: "syncing",
        },
      },
    },
    onboarding: {
      entry: "clearError",
      invoke: {
        src: "onboardRetailer",
        input: ({context}) => {
          if (!context.merchantId || !context.pos) throw new Error("Missing onboarding input");
          return {merchantId: context.merchantId, pos: context.pos};
        },
        onDone: {
          target: "idle",
          actions: "completeOnboarding",
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
      on: {
        "SET_ENV": {actions: "setEnv"},
      },
    },
    syncing: {
      entry: "clearError",
      invoke: {
        src: "syncInventory",
        input: ({context}) => {
          if (!context.merchantId) throw new Error("Missing sync input");
          return {merchantId: context.merchantId};
        },
        onDone: {
          target: "idle",
          actions: "completeSync",
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
      on: {
        "SET_ENV": {actions: "setEnv"},
      },
    },
  },
});
