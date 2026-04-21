import {useCallback, useMemo} from "react";
import {assign, fromPromise, setup} from "xstate";
import {useMachine} from "@xstate/react";
import type {ImportContext, ImportResult, ImportState, Wine, WineExtraction} from "./types";
import {uploadProducerWinesCsv} from "./client";
import {producerClient} from "../../../services/apolloClient.ts";
import {PRODUCER_BY_ID} from "../../../services/producer/producerGraph.ts";
import {ADD_WINE_MUTATION} from "../../../services/producer/wineGraph.ts";

type AddWinePayload = {
  Wine?: {
    addWine?: {
      name: string;
      vintage?: number | null;
      varietal?: string | null;
    };
  };
};

type ProducerImportEvent =
  | { type: "FILE_SELECTED"; file: File }
  | { type: "UPLOAD" }
  | { type: "EDIT_WINE"; index: number; patch: Partial<Wine> }
  | { type: "CONFIRM" }
  | { type: "RESET" };

function hasOutput<T>(event: unknown): event is { output: T } {
  return !!event && typeof event === "object" && "output" in event;
}

function hasError(event: unknown): event is { error: unknown } {
  return !!event && typeof event === "object" && "error" in event;
}

// XState machine for the import flow
const importMachine = setup({
  types: {
    context: {} as ImportContext,
    input: {} as { producerId: string },
    events: {} as ProducerImportEvent,
  },
  actors: {
    uploadCsv: fromPromise<WineExtraction, { producerId: string; file: File }>(async ({input}) => {
      return await uploadProducerWinesCsv(input.producerId, input.file);
    }),
    confirmAndSave: fromPromise<ImportResult, { producerId: string; wines: Wine[] }>(async ({input}) => {
      const {producerId, wines} = input;
      const savedWines: Wine[] = [];
      const errors: { row: number; message: string }[] = [];

      for (let i = 0; i < wines.length; i++) {
        const w = wines[i];
        try {
          const varietal = Array.isArray(w.varietals) && w.varietals.length > 0 ? w.varietals[0] : undefined;
          const vintage = w.vintage ?? undefined;

          if (!w.name || !varietal || vintage === undefined || vintage === null) {
            errors.push({row: i + 1, message: "Missing required fields: name, varietal, and vintage are required"});
            continue;
          }

          const variables: { input: { name: string; producerId: string; varietal: string; vintage: number; description?: string } } = {
            input: {
              name: w.name,
              producerId,
              varietal,
              vintage: Number(vintage),
              description: w.description ?? undefined,
            },
          };

          const {data} = await producerClient.mutate<AddWinePayload>({mutation: ADD_WINE_MUTATION, variables});
          const created = data?.Wine?.addWine;
          if (created) {
            savedWines.push({
              name: created.name,
              vintage: created.vintage ?? undefined,
              varietals: created.varietal ? [created.varietal] : undefined,
              description: undefined,
            });
          } else {
            errors.push({row: i + 1, message: "No wine returned"});
          }
        } catch (err: unknown) {
          errors.push({row: i + 1, message: readableError(err)});
        }
      }

      // After batch finishes, refetch producer inventory so UI updates without reload.
      try {
        await producerClient.refetchQueries({
          include: [PRODUCER_BY_ID],
        });
        console.debug("[import] post-import refetch succeeded");
      } catch (e) {
        // Non-fatal: if refetch fails, we still return the import result.
        console.warn("[import] post-import refetch failed", e);
      }

      return {
        saved: savedWines.length,
        failed: errors.length,
        skipped: 0,
        wines: savedWines,
        errors: errors.length ? errors : undefined,
      } satisfies ImportResult;
    }),
  },
  actions: {
    setFile: assign(({context, event}) => {
      if (event.type !== "FILE_SELECTED") return context;
      return {
        ...context,
        file: event.file,
        extraction: undefined,
        editableWines: [],
        result: undefined,
        error: undefined,
      };
    }),
    setExtraction: assign(({context, event}) => {
      if (!hasOutput<WineExtraction>(event)) return context;
      const extraction = event.output;
      return {
        ...context,
        extraction,
        editableWines: [...(extraction?.wines ?? [])],
        error: undefined,
      };
    }),
    setError: assign(({context, event}) => {
      const err = hasError(event) ? event.error : event;
      const message = readableError(err);
      return {...context, error: message};
    }),
    applyEdit: assign(({context, event}) => {
      if (event.type !== "EDIT_WINE") return context;
      const {index, patch} = event;
      const next = [...context.editableWines];
      next[index] = {...next[index], ...patch} as Wine;
      return {...context, editableWines: next};
    }),
    setResult: assign(({context, event}) => {
      if (!hasOutput<ImportResult>(event)) return context;
      const result = event.output;
      return {...context, result};
    }),
    resetCtx: assign(({context}) => ({producerId: context.producerId, editableWines: []} as ImportContext)),
    clearError: assign(({context}) => ({...context, error: undefined})),
  },
}).createMachine({
  id: "import",
  initial: "idle",
  context: ({input}) => ({
    producerId: input.producerId,
    editableWines: [],
  }),
  states: {
    idle: {
      on: {
        FILE_SELECTED: {actions: ["setFile"]},
        UPLOAD: {
          guard: ({context}) => !!context.file,
          target: "uploading",
          actions: ["clearError"],
        },
        RESET: {actions: ["resetCtx"]},
      },
    },
    uploading: {
      invoke: {
        src: "uploadCsv",
        input: ({context}) => ({producerId: context.producerId, file: context.file!}),
        onDone: {target: "reviewing", actions: ["setExtraction"]},
        onError: {target: "error", actions: ["setError"]},
      },
      on: {
        RESET: {target: "idle", actions: ["resetCtx"]},
      },
    },
    reviewing: {
      on: {
        EDIT_WINE: {actions: ["applyEdit"]},
        CONFIRM: {target: "confirming", actions: ["clearError"]},
        RESET: {target: "idle", actions: ["resetCtx"]},
      },
    },
    confirming: {
      invoke: {
        src: "confirmAndSave",
        input: ({context}) => ({producerId: context.producerId, wines: context.editableWines}),
        onDone: {target: "success", actions: ["setResult"]},
        onError: {target: "error", actions: ["setError"]},
      },
      on: {
        RESET: {target: "idle", actions: ["resetCtx"]},
      },
    },
    success: {
      on: {
        RESET: {target: "idle", actions: ["resetCtx"]},
      },
    },
    error: {
      on: {
        RESET: {target: "idle", actions: ["resetCtx"]},
        UPLOAD: {
          guard: ({context}) => !!context.file,
          target: "uploading",
          actions: ["clearError"],
        },
      },
    },
  },
});

export function useImportMachine(producerId: string) {
  const [state, send] = useMachine(importMachine, {input: {producerId}});

  const selectFile = useCallback((file: File) => send({type: "FILE_SELECTED", file}), [send]);
  const upload = useCallback(() => send({type: "UPLOAD"}), [send]);
  const editWine = useCallback((index: number, patch: Partial<Wine>) => send({
    type: "EDIT_WINE",
    index,
    patch
  }), [send]);
  const confirm = useCallback(() => send({type: "CONFIRM"}), [send]);
  const reset = useCallback(() => send({type: "RESET"}), [send]);

  const invalids = useMemo(() => validateWines(state.context.editableWines), [state.context.editableWines]);

  // Map XState state to the previous ImportState union for compatibility
  const current: ImportState = typeof state.value === "string" ? state.value : "idle";

  return {state: current, ctx: state.context, selectFile, upload, editWine, confirm, reset, invalids};
}

function readableError(e: unknown): string {
  const obj = e && typeof e === "object" ? (e as Record<string, unknown>) : undefined;

  // Apollo GraphQLError shapes
  const gqlErrors = Array.isArray(obj?.graphQLErrors) ? (obj?.graphQLErrors as Array<Record<string, unknown>>) : [];
  const gqlMsg = gqlErrors.length > 0 && typeof gqlErrors[0]?.message === "string" ? gqlErrors[0].message : undefined;
  const networkError = obj?.networkError as Record<string, unknown> | undefined;
  const response = obj?.response as Record<string, unknown> | undefined;
  const responseData = response?.data as Record<string, unknown> | undefined;
  const netMsg = typeof networkError?.message === "string" ? networkError.message : undefined;
  const respMsg = typeof responseData?.message === "string" ? responseData.message : undefined;
  const msg = gqlMsg || respMsg || netMsg || (typeof obj?.message === "string" ? obj.message : undefined) || "Unknown error";
  return typeof msg === "string" ? msg : "Request failed";
}

function validateWines(wines: Wine[]): { index: number; message: string }[] {
  const errors: { index: number; message: string }[] = [];
  const currentYear = new Date().getFullYear();
  wines.forEach((w, i) => {
    if (!w.name || !String(w.name).trim()) errors.push({index: i, message: "Name is required"});
    if (w.vintage !== undefined && w.vintage !== null) {
      const v = Number(w.vintage);
      if (!Number.isInteger(v) || String(v).length !== 4 || v > currentYear) {
        errors.push({index: i, message: "Vintage must be a 4-digit year ≤ current year or empty"});
      }
    }
  });
  return errors;
}
