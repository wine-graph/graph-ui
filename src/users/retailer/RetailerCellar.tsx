import {useParams} from "react-router-dom";
import {RETAILER_QUERY} from "../../services/retailer/retailerGraph.ts";
import {useQuery} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import {RefreshCcw, Store} from "lucide-react";
import {useAuth} from "../../auth";
import {useMemo, useState} from "react";
import type {Retailer, RetailerInventory} from "./retailer.ts";
import {RetailerInventorySection} from "./inventory/RetailerInventorySection.tsx";
import RetailerInventorySkeleton from "./inventory/RetailerInventorySkeleton.tsx";
import {useRetailerFlow} from "./useRetailerFlow.ts";
import RetailerLocationCard from "./components/RetailerLocationCard.tsx";
import {Card, Notice, SectionTitle} from "../../components/ui";

export const RetailerCellar = () => {
  const {user, isRetailer, isAuthenticated, isLoading, pos} = useAuth();
  const {retailerId} = useParams();

  // Determine the effective retailer id to query: route param if present, otherwise the signed-in retailer id
  const selfId = user?.user?.role?.id;
  const effectiveRetailerId = (retailerId ?? selfId) as string | undefined;

  const {data, loading, refetch} = useQuery(RETAILER_QUERY, {
    variables: {id: effectiveRetailerId},
    client: retailerClient,
    skip: !effectiveRetailerId,
  });

  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRefreshingRetailerAfterOnboard, setIsRefreshingRetailerAfterOnboard] = useState(false);

  const retailer = data?.Retailer?.retailer as Retailer | undefined;
  const inventory = useMemo(() => {
    const inv = retailer?.inventory as RetailerInventory[] | undefined;
    return Array.isArray(inv) ? inv : [];
  }, [retailer]);

  const merchantId = pos.token?.merchantId ?? null;
  const isOnboarded = Boolean(retailer?.location?.id);

  const flow = useRetailerFlow({
    merchantId,
    provider: pos.provider,
    isAuthorized: pos.isAuthorized,
    isOnboarded,
    onOnboarded: async () => {
      setIsRefreshingRetailerAfterOnboard(true);
      await refetch();
      setIsRefreshingRetailerAfterOnboard(false);
      setBanner({type: "success", message: "Store connected. Inventory sync is ready."});
    },
    onSynced: async () => {
      await refetch();
      setBanner({type: "success", message: "Inventory sync completed successfully."});
    },
    onError: (message) => setBanner({type: "error", message}),
  });

  const canSync = useMemo(() => {
    const roleId = user?.user?.role?.id;
    const owns = Boolean(roleId && (!retailerId || roleId === retailerId));
    return Boolean(isRetailer && owns && isOnboarded && pos.isAuthorized && pos.provider && pos.token);
  }, [isOnboarded, isRetailer, pos, retailerId, user?.user?.role?.id]);

  const handleSync = () => {
    setBanner(null);
    flow.clearError();
    flow.requestSync();
  };

  const handleOnboard = () => {
    setBanner(null);
    flow.clearError();
    flow.requestOnboard();
  };

  // Must be signed in
  if (!isAuthenticated) {
    return <div className="p-8 text-center">Sign in to view retailer inventory.</div>;
  }

  // Role gate: retailer only
  if (!isRetailer) {
    return <div className="p-8 text-center">Access denied. Retailer only.</div>;
  }

  // Ownership gate: retailers may only view their own inventory page
  const ownsPage = Boolean(selfId && (!retailerId || selfId === retailerId));
  if (!ownsPage) {
    return <div className="p-8 text-center">Retailer not found.</div>;
  }

  const shouldHoldForAutoOnboarding = Boolean(
    !retailer &&
      !flow.hasError &&
      pos.isAuthorized &&
      merchantId &&
      flow.posEnum &&
      (flow.onboarding || !flow.autoOnboardAttempted || isRefreshingRetailerAfterOnboard)
  );

  if (shouldHoldForAutoOnboarding) {
    return <RetailerInventorySkeleton/>;
  }

  // Unified loading state: wait for both auth and retailer query to settle
  if (isLoading || loading) return <RetailerInventorySkeleton/>;

  // Data guard
  if (!retailer) {
    // Owner but no retailer payload yet: show explicit onboarding empty state
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        {/* Optional banner */}
        {banner && (
          <Notice
            variant={banner.type}
            className="mb-6 text-sm"
            role="status"
          >
            {banner.message}
          </Notice>
        )}

        <Card className="p-6">
          <SectionTitle
            title="Retailer inventory"
            desc="Add your store details to complete onboarding, then you can sync inventory from your POS."
            titleClassName="text-[30px] tracking-tight"
          />

          <div
            className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-token rounded-[var(--radius-sm)] bg-[color:var(--color-panel)] p-4">
            <div className="text-sm">
              <div className="font-medium">Add store details</div>
              <div className="text-[color:var(--color-fg-muted)] mt-0.5">Complete retailer onboarding to enable inventory sync.</div>
              {!pos.isAuthorized && (
                <div className="mt-2 text-[color:var(--color-fg-muted)]">
                  Connect your POS to continue.
                </div>
              )}
            </div>
            <div className="shrink-0">
              <button
                onClick={handleOnboard}
                disabled={flow.onboarding || !isRetailer || !pos.isAuthorized || !pos.provider || !flow.posEnum}
                className={`btn btn-secondary ${
                  flow.onboarding ? "opacity-80 cursor-not-allowed" : ""
                }`}
                aria-label="Onboard retailer"
                title="Onboard retailer"
              >
                <Store className={`w-4 h-4 ${flow.onboarding ? "animate-pulse" : ""}`}/>
                <span>{flow.onboarding ? "Saving…" : "Onboard retailer"}</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <RetailerLocationCard retailer={retailer}>
        {/* Explicit onboarding: show prompt if location info is missing */}
        {!retailer.location?.id && (
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-token rounded-[var(--radius-sm)] bg-[color:var(--color-panel)] p-4">
            <div className="text-sm">
              <div className="font-medium">Add store details</div>
              <div className="text-[color:var(--color-fg-muted)] mt-0.5">Complete retailer onboarding to enable inventory sync.</div>
            </div>
            <div className="shrink-0">
              <button
                onClick={handleOnboard}
                disabled={flow.onboarding || !isRetailer || !pos.isAuthorized || !pos.provider || !flow.posEnum}
                className={`btn btn-secondary ${flow.onboarding ? "opacity-80 cursor-not-allowed" : ""}`}
                aria-label="Onboard retailer"
                title="Onboard retailer"
              >
                <Store className={`w-4 h-4 ${flow.onboarding ? "animate-pulse" : ""}`}/>
                <span>{flow.onboarding ? "Saving…" : "Onboard retailer"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Sync controls: mobile and desktop variants */}
        {canSync && (
          <>
            <div className="md:hidden mt-5">
              <button
                onClick={handleSync}
                disabled={flow.syncing}
                className={`w-full btn btn-secondary ${flow.syncing ? "opacity-80 cursor-not-allowed" : ""}`}
                title="Sync Inventory"
                aria-label="Sync Inventory"
              >
                <RefreshCcw className={`w-4 h-4 ${flow.syncing ? "animate-spin" : ""}`}/>
                <span>{flow.syncing ? "Syncing inventory…" : "Sync inventory"}</span>
              </button>
              <div className="mt-2 text-[12px] leading-snug text-[color:var(--color-fg-muted)]">
                {flow.syncing ? "Please wait, this may take up to a minute." : (pos.provider ? `Provider: ${retailer?.pos}` : "")}
              </div>
            </div>

            <div className="hidden md:block absolute bottom-4 right-4 text-right">
              <button
                onClick={handleSync}
                disabled={flow.syncing}
                className={`btn btn-secondary ${flow.syncing ? "opacity-80 cursor-not-allowed" : ""}`}
                title="Sync Inventory"
                aria-label="Sync Inventory"
              >
                <RefreshCcw className={`w-4 h-4 ${flow.syncing ? "animate-spin" : ""}`}/>
                <span className="text-sm">
                  {flow.syncing ? "Syncing inventory…" : "Sync inventory"}
                </span>
              </button>
              <div className="mt-1 text-[11px] leading-snug text-[color:var(--color-fg-muted)]">
                {flow.syncing ? "Please wait, this may take up to a minute." : (pos.provider ? `Provider: ${retailer?.pos}` : "")}
              </div>
            </div>
          </>
        )}
      </RetailerLocationCard>

      <RetailerInventorySection inventory={inventory}/>

    </div>
  );
};
