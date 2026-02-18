import {useParams} from "react-router-dom";
import {RETAILER_INVENTORY_MUTATION, RETAILER_QUERY} from "../../services/retailer/retailerGraph.ts";
import {useMutation, useQuery} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import RetailerInventoryTable from "./RetailerInventoryTable.tsx";
import {Globe, Mail, MapPin, Phone, RefreshCcw, Store} from "lucide-react";
import Spinner from "../../components/Spinner.tsx";
import {useAuth} from "../../auth";
import {useMemo, useState} from "react";
import useRetailerOnboarding from "./useRetailerOnboarding.ts";
import type {Retailer, RetailerInventory} from "./retailer.ts";

export const RetailersInventory = () => {
  const {user, isRetailer, pos} = useAuth();
  const {retailerId} = useParams();
  const {data, loading, refetch} = useQuery(RETAILER_QUERY, {
    variables: {id: retailerId},
    client: retailerClient,
  });

  const [syncInventory, {loading: syncing}] = useMutation(RETAILER_INVENTORY_MUTATION, {
    client: retailerClient,
  });

  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const retailer = data?.Retailer?.retailer as Retailer | undefined;
  const inventory = useMemo(() => {
    const inv = retailer?.inventory as RetailerInventory[] | undefined;
    return Array.isArray(inv) ? inv : [];
  }, [retailer]);

  // Initialize implicit onboarding when a retailer page is visited but the retailer record is not found
  const merchantId = retailerId ?? retailer?.id ?? null;
  const shouldOnboard = !retailer;
  useRetailerOnboarding({
    merchantId,
    isAuthorized: Boolean(pos.isAuthorized && shouldOnboard),
    provider: pos.provider?.toUpperCase() ?? null,
    token: pos.token ?? null,
    onCompleted: async () => {
      try {
        await refetch();
      } catch {
        // ignore refetch errors here; page will still be navigable
      }
    },
  });

  // Local UI state for Inventory search
  const [query, setQuery] = useState("");

  const canSync = useMemo(() => {
    const roleId = user?.user?.role?.id;
    const ownsPage = Boolean(roleId && retailerId && roleId === retailerId);
    return Boolean(isRetailer && ownsPage && pos.isAuthorized && pos.provider && pos.token);
  }, [pos, isRetailer, retailerId, user?.user?.role?.id]);

  const handleSync = async () => {
    setBanner(null);
    const merchantId = user?.user?.role?.id;
    if (!merchantId) return;
    try {
      await syncInventory({
        variables: {merchantId},
      });
      await refetch();
      setBanner({type: "success", message: "Inventory sync completed successfully."});
    } catch (e: any) {
      setBanner({type: "error", message: e?.message ?? "Inventory sync failed."});
    }
  };

  // Filtered rows based on search query (name/varietal/vintage)
  const filteredInventory = useMemo(() => {
    if (!query.trim()) return inventory;
    const q = query.toLowerCase();
    return inventory?.filter((w: RetailerInventory) => {
      const vintage = w.vintage ? String(w.vintage) : "";
      return (
        (w.name?.toLowerCase?.() ?? "").includes(q) ||
        (w.varietal?.toLowerCase?.() ?? "").includes(q) ||
        vintage.toLowerCase().includes(q)
      );
    });
  }, [inventory, query]);

  if (loading) return <Spinner label="Loading retailer…"/>;

  if (!retailer) return <div className="p-8 text-center">Retailer not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Ultra-compact retailer header */}
      <div className="border-2 border-[color:var(--color-border)] bg-panel-token p-5 mb-8 relative">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black tracking-tight truncate">
              {retailer.name}
            </h1>
            <p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
              {retailer.location?.city && `${retailer.location.city}, `}
              {retailer.location?.state}
              {retailer.location?.zipCode && ` ${retailer.location.zipCode}`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Store className="w-8 h-8 text-neutral-900"/>
          </div>
        </div>

        {/* Tight info row — trim low-priority fields on mobile */}
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {/* Street address: show on md+, hide on smaller screens to reduce clutter */}
          {retailer.location?.address && (
            <div className="hidden md:flex items-center gap-2.5">
              <MapPin className="w-4.5 h-4.5 text-neutral-900"/>
              <span className="text-[color:var(--color-fg-muted)]">
                {retailer.location.address}
              </span>
            </div>
          )}

          {/* Keep phone visible on mobile for quick action */}
          {retailer.location?.phone && (
            <a href={`tel:${retailer.location.phone}`}
               className="flex items-center gap-2.5 transition">
              <Phone className="w-4.5 h-4.5 text-neutral-900"/>
              <span>{retailer.location.phone}</span>
            </a>
          )}

          {/* Email: hide on mobile, show from md+ */}
          {retailer.location?.contactEmail && (
            <a href={`mailto:${retailer.location.contactEmail}`}
               className="hidden md:flex items-center gap-2.5 transition">
              <Mail className="w-4.5 h-4.5 text-neutral-900"/>
              <span className="underline">Email</span>
            </a>
          )}

          {/* Website: hide on mobile, show from md+ */}
          {retailer.location?.website && (
            <a href={retailer.location.website} target="_blank" rel="noreferrer"
               className="hidden md:flex items-center gap-2.5 transition">
              <Globe className="w-4.5 h-4.5 text-neutral-900"/>
              <span className="underline">Website</span>
            </a>
          )}
        </div>

        {/* Sync controls: mobile and desktop variants */}
        {canSync && (
          <>
            {/* Mobile: full-width action bar at the bottom of the header card */}
            <div className="md:hidden mt-5">
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-[color:var(--color-border)] hover:bg-[color:var(--color-muted)] transition text-sm min-h-[44px] ${syncing ? "opacity-80 cursor-not-allowed" : ""}`}
                title="Sync Inventory"
                aria-label="Sync Inventory"
              >
                <RefreshCcw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}/>
                <span>{syncing ? "Syncing inventory…" : "Sync inventory"}</span>
              </button>
              <div className="mt-2 text-[12px] leading-snug text-[color:var(--color-fg-muted)]">
                {syncing ? "Please wait, this may take up to a minute." : (pos.provider ? `Provider: ${retailer?.pos}` : "")}
              </div>
            </div>

            {/* Desktop: subtle absolute control in bottom-right */}
            <div className="hidden md:block absolute bottom-4 right-4 text-right">
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`btn-minimal inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[color:var(--color-border)] hover:bg-[color:var(--color-muted)] transition ${syncing ? "opacity-80 cursor-not-allowed" : ""}`}
                title="Sync Inventory"
                aria-label="Sync Inventory"
              >
                <RefreshCcw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}/>
                <span className="text-sm">
                  {syncing ? "Syncing inventory…" : "Sync inventory"}
                </span>
              </button>
              <div className="mt-1 text-[11px] leading-snug text-[color:var(--color-fg-muted)]">
                {syncing ? "Please wait, this may take up to a minute." : (pos.provider ? `Provider: ${retailer?.pos}` : "")}
              </div>
            </div>
          </>
        )}

      </div>

      {/* Inventory: List + Detail pattern */}
      <div>
        {/* Screen header: title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Inventory</h2>
            <p className="text-sm text-[color:var(--color-fg-muted)] mt-0.5">{inventory.length} wines available</p>
          </div>
        </div>

        {/* Controls row: search above table */}
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory…"
            className="w-full h-10 px-3 border-2 border-[color:var(--color-border)] bg-[color:var(--color-panel)] placeholder-[color:var(--color-fg-muted)]"
            aria-label="Search inventory"
          />
        </div>

        {banner && (
          <div
            className={`mb-4 border-2 border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-fg)]`}
            role="status"
            aria-live="polite"
          >
            <span className="font-medium mr-1">{banner.type === "success" ? "Success:" : "Error:"}</span>
            {banner.message}
          </div>
        )}

        {filteredInventory?.length === 0 ? (
          <div
            className="text-center py-16 text-[color:var(--color-fg-muted)] border-2 border-dashed border-[color:var(--color-border)]">
            {inventory?.length === 0 ? (
              <>
                <div>No wines in inventory yet.</div>
                {/*{canSync && (*/}
                {/*  <div className="mt-4">*/}
                {/*    <button*/}
                {/*      onClick={handleSync}*/}
                {/*      disabled={syncing}*/}
                {/*      className={`h-10 px-3 border-2 border-[color:var(--color-fg)] bg-[color:var(--color-fg)] text-[color:var(--color-bg)] ${syncing ? "opacity-80 cursor-not-allowed" : ""}`}*/}
                {/*    >*/}
                {/*      {syncing ? "Syncing…" : "Sync inventory"}*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*)}*/}
              </>
            ) : (
              <>
                <div>No inventory matches your search.</div>
                <button className="mt-3 underline" onClick={() => setQuery("")}>Clear search</button>
              </>
            )}
          </div>
        ) : (
          <RetailerInventoryTable
            wines={filteredInventory}
          />
        )}
      </div>

    </div>
  );
};