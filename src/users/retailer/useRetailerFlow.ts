import {useEffect, useMemo, useRef} from "react";
import {useMachine} from "@xstate/react";
import {type PosEnum, retailerFlowMachine} from "./retailerFlowMachine.ts";

type Params = {
  merchantId: string | null;
  provider: string | null | undefined;
  isAuthorized: boolean;
  isOnboarded: boolean;
  autoOnboardEnabled?: boolean;
  onOnboarded?: () => void | Promise<void>;
  onSynced?: () => void | Promise<void>;
  onError?: (message: string) => void;
};

const toPosEnum = (provider: string): PosEnum | null => {
  const lower = provider.toLowerCase();
  if (lower === "square" || lower === "clover" || lower === "shopify") {
    return lower.toUpperCase() as PosEnum;
  }
  return null;
};

export const useRetailerFlow = ({
  merchantId,
  provider,
  isAuthorized,
  isOnboarded,
  autoOnboardEnabled = true,
  onOnboarded,
  onSynced,
  onError,
}: Params) => {
  const [flowState, flowSend] = useMachine(retailerFlowMachine);
  const prevCompletedAtRef = useRef(0);
  const posEnum = provider ? toPosEnum(provider) : null;

  useEffect(() => {
    flowSend({
      type: "SET_ENV",
      merchantId,
      pos: posEnum,
      isAuthorized,
      isOnboarded,
    });
  }, [flowSend, merchantId, isAuthorized, posEnum, isOnboarded]);

  useEffect(() => {
    if (!autoOnboardEnabled) return;
    flowSend({type: "AUTO_ONBOARD"});
  }, [autoOnboardEnabled, flowSend, merchantId, isAuthorized, posEnum, isOnboarded]);

  useEffect(() => {
    if (!flowState.context.error || !onError) return;
    onError(flowState.context.error);
  }, [flowState.context.error, onError]);

  useEffect(() => {
    const completedAt = flowState.context.completedAt;
    if (!completedAt || completedAt === prevCompletedAtRef.current) return;
    prevCompletedAtRef.current = completedAt;

    if (flowState.context.lastCompletedAction === "onboard") {
      void onOnboarded?.();
      return;
    }

    if (flowState.context.lastCompletedAction === "sync") {
      void onSynced?.();
    }
  }, [flowState.context.completedAt, flowState.context.lastCompletedAction, onOnboarded, onSynced]);

  const autoOnboardKey = useMemo(
    () => merchantId && posEnum ? `${posEnum}::${merchantId}` : null,
    [merchantId, posEnum]
  );

  const autoOnboardAttempted = Boolean(autoOnboardKey && flowState.context.autoAttemptedKey === autoOnboardKey);

  return {
    posEnum,
    onboarding: flowState.matches("onboarding"),
    syncing: flowState.matches("syncing"),
    autoOnboardAttempted,
    clearError: () => flowSend({type: "CLEAR_ERROR"}),
    requestOnboard: () => flowSend({type: "ONBOARD.REQUEST"}),
    requestSync: () => flowSend({type: "SYNC.REQUEST"}),
    hasError: Boolean(flowState.context.error),
  };
};

export default useRetailerFlow;
