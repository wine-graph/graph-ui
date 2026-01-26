import {useEffect} from "react";
import {useMutation} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import {RETAILER_ONBOARDING_MUTATION} from "../../services/retailer/retailerGraph.ts";
import type {PosToken} from "../../auth";

type Params = {
  merchantId?: string | null;
  isAuthorized: boolean;
  provider?: string | null;
  token?: PosToken | null;
};

// todo figure out when how to trigger this easily and only once

/**
 * Implicit, idempotent retailer onboarding.
 * Fires once when the app detects an authorized Square connection with a merchantId
 * for the authenticated retailer. Uses localStorage to avoid duplicate calls within the same
 * browser, and should be safe to repeat thanks to backend idempotency.
 */
export const useRetailerOnboarding = ({merchantId, isAuthorized, provider, token}: Params) => {

  const [onboard] = useMutation(RETAILER_ONBOARDING_MUTATION, {
    client: retailerClient,
  });

  useEffect(() => {
    // Basic guards
    if (!isAuthorized) return;
    if (!merchantId) return;
    if (!provider) return; // must have provider enum for mutation
    if (!token) return; // ensure we truly have a token for this provider

    const rid = merchantId ?? "unknown";

    onboard({
      variables: {merchantId, pos: provider},
    })
      .then(() => {
        console.debug("[onboarding] Retailer onboarding completed for", {retailerId: rid, merchantId, provider});
      })
      .catch((e) => {
        console.error("[onboarding] Retailer onboarding failed", e);
      });
  }, [isAuthorized, merchantId, onboard, provider, token]);
};

export default useRetailerOnboarding;
