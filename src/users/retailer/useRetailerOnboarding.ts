import {useEffect, useMemo, useRef} from "react";
import {useMutation} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import {RETAILER_ONBOARDING_MUTATION} from "../../services/retailer/retailerGraph.ts";
import type {PosToken} from "../../auth";

type Params = {
  merchantId?: string | null;
  isAuthorized: boolean;
  provider?: string | null;
  token?: PosToken | null;
  onCompleted?: () => void | Promise<void>;
};

/**
 * Implicit, idempotent retailer onboarding.
 * Fires once when the app detects an authorized POS connection with a merchantId
 * for the authenticated retailer. Uses localStorage to avoid duplicate calls within the same
 * browser, and should be safe to repeat thanks to backend idempotency.
 */
// Module-level single-flight guard to prevent parallel onboarding calls
const inflight = new Set<string>();

export const useRetailerOnboarding = ({merchantId, isAuthorized, provider, token, onCompleted}: Params) => {

  const [onboard] = useMutation(RETAILER_ONBOARDING_MUTATION, {
    client: retailerClient,
  });

  // Stable key for this merchant/provider
  const key = useMemo(() => {
    const rid = merchantId ?? "";
    const prov = (provider ?? "").toLowerCase();
    return rid && prov ? `${prov}::${rid}` : null;
  }, [merchantId, provider]);

  // Per-instance guard (helps with React StrictMode double-effect in dev)
  const startedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Basic guards
    if (!isAuthorized) return;
    if (!merchantId) return;
    if (!provider) return; // must have provider enum for mutation
    if (!token) return; // ensure we truly have a token for this provider
    if (!key) return;

    // Global dedupe: if another call is in-flight for this key, skip
    if (inflight.has(key)) return;

    // Cross-session dedupe: if we've already successfully onboarded in this browser, skip
    const doneKey = `retailer_onboarded::${key}`;
    if (localStorage.getItem(doneKey) === "done") return;

    // Per-instance guard to avoid StrictMode double-call in dev
    if (startedRef.current[key]) return;
    startedRef.current[key] = true;

    inflight.add(key);

    const rid = merchantId ?? "unknown";

    onboard({
      variables: {merchantId, pos: provider},
    })
      .then(() => {
        console.debug("[onboarding] Retailer onboarding completed for", {retailerId: rid, merchantId, provider});
        try {
          localStorage.setItem(doneKey, "done");
        } catch {
          // localStorage may be unavailable; ignore
        }
        // Allow caller to react (e.g., refetch queries) immediately without requiring a reload
        if (onCompleted) {
          try {
            const result = onCompleted();
            // Best-effort await if a promise is returned, without blocking UI
            if (result && typeof (result as Promise<void>).then === "function") {
              (result as Promise<void>).catch(() => {});
            }
          } catch {
            // no-op: onboarding succeeded; completion side-effect failed silently
          }
        }
      })
      .catch((e) => {
        console.error("[onboarding] Retailer onboarding failed", e);
      })
      .finally(() => {
        inflight.delete(key);
      });
  }, [isAuthorized, merchantId, onboard, provider, token, onCompleted, key]);
};

export default useRetailerOnboarding;
