import {useCallback, useMemo} from "react";
import {assign, fromPromise, setup} from "xstate";
import {useMachine} from "@xstate/react";
import type {ImportContext, ImportResult, ImportState, Wine, WineExtraction} from "./types";
import {uploadProducerWinesCsv} from "./client";
import {producerClient} from "../../../services/apolloClient.ts";
import {PRODUCER_BY_ID} from "../../../services/producer/producerGraph.ts";
import {ADD_WINE_MUTATION} from "../../../services/producer/wineGraph.ts";

// XState machine for the import flow
const importMachine = setup({
  types: {
    context: {} as ImportContext,
    input: {} as { producerId: string },
    events: {} as
      | { type: "FILE_SELECTED"; file: File }
      | { type: "UPLOAD" }
      | { type: "EDIT_WINE"; index: number; patch: Partial<Wine> }
      | { type: "CONFIRM" }
      | { type: "RESET" },
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

          const variables = {
            input: {
              name: w.name,
              producerId,
              varietal,
              vintage,
              description: w.description ?? undefined,
            },
          } as any;

          const {data} = await producerClient.mutate({mutation: ADD_WINE_MUTATION, variables});
          const created = (data as any)?.Wine?.addWine;
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
        } catch (err: any) {
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
      const file = (event as any).file as File | undefined;
      return {
        ...context,
        file,
        extraction: undefined,
        editableWines: [],
        result: undefined,
        error: undefined,
      };
    }),
    setExtraction: assign(({context, event}) => {
      const extraction = (event as any).output as WineExtraction;
      return {
        ...context,
        extraction,
        editableWines: [...(extraction?.wines ?? [])],
        error: undefined,
      };
    }),
    setError: assign(({context, event}) => {
      const err = (event as any).error;
      const message = readableError(err);
      return {...context, error: message};
    }),
    applyEdit: assign(({context, event}) => {
      const {index, patch} = event as any;
      const next = [...context.editableWines];
      next[index] = {...next[index], ...patch} as Wine;
      return {...context, editableWines: next};
    }),
    setResult: assign(({context, event}) => {
      const result = (event as any).output as ImportResult;
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
  const current: ImportState = (state.value as any) as ImportState;

  return {state: current, ctx: state.context, selectFile, upload, editWine, confirm, reset, invalids};
}

function readableError(e: any): string {
  // Apollo GraphQLError shapes
  const gqlMsg = e?.graphQLErrors && e.graphQLErrors.length > 0 ? e.graphQLErrors[0]?.message : undefined;
  const netMsg = e?.networkError?.message;
  const respMsg = e?.response?.data?.message;
  const msg = gqlMsg || respMsg || netMsg || e?.message || "Unknown error";
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
