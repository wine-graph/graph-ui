import {useEffect, useRef} from "react";
import {useMutation} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import {RETAILER_ONBOARDING_MUTATION} from "../../services/retailerGraph.ts";

type Params = {
  retailerId?: string | null;
  merchantId?: string | null;
  isAuthorized: boolean;
};

/**
 * Implicit, idempotent retailer onboarding.
 * Fires once when the app detects an authorized Square connection with a merchantId
 * for the authenticated retailer. Uses localStorage to avoid duplicate calls within the same
 * browser, and should be safe to repeat thanks to backend idempotency.
 */
export const useRetailerOnboarding = ({retailerId, merchantId, isAuthorized}: Params) => {
  const firedRef = useRef(false);

  const [onboard] = useMutation(RETAILER_ONBOARDING_MUTATION, {
    client: retailerClient,
  });

  useEffect(() => {
    // Require a valid, non-expired authorization and a Square merchant id
    if (!isAuthorized) return;
    if (!merchantId) return;

    const rid = retailerId ?? "unknown";
    const key = `onboarded:${rid}:${merchantId}`;

    if (firedRef.current) return;
    if (localStorage.getItem(key)) return;

    firedRef.current = true;

    onboard({
      variables: {merchantId},
    })
      .then(() => {
        console.debug("[onboarding] Retailer onboarding completed for", {retailerId: rid, merchantId});
        try {
          localStorage.setItem(key, String(Date.now()));
        } catch {
          // ignore storage errors
        }
      })
      .catch((e) => {
        console.error("[onboarding] Retailer onboarding failed", e);
        // allow retry on next mount/refresh
        firedRef.current = false;
      });
  }, [isAuthorized, merchantId, onboard, retailerId]);
};

export default useRetailerOnboarding;
