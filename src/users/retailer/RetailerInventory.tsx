import {useParams} from "react-router-dom";
import {RETAILER_QUERY, RETAILER_INVENTORY_MUTATION} from "../../services/retailerGraph.ts";
import {useMutation, useQuery} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import RetailerInventoryTable from "./RetailerInventoryTable.tsx";
import {Globe, Mail, MapPin, Phone, Store, RefreshCcw} from "lucide-react";
import Spinner from "../../components/common/Spinner.tsx";
import {useAuth} from "../../auth/authContext.ts";
import {useMemo, useState} from "react";

export const RetailerInventory = () => {
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

  const retailer = data?.Retailer?.retailer;
  const inventory = Array.isArray(retailer?.inventory) ? retailer.inventory : [];

  const canSync = useMemo(() => {
    const square = pos.square;
    const isAuthorized = !!square && new Date(square.expires_at).getTime() > Date.now();
    const ownsPage = user?.user?.role?.id && retailerId && user.user.role.id === retailerId;
    return Boolean(isRetailer && ownsPage && isAuthorized && square?.merchant_id);
  }, [isRetailer, pos.square, retailerId, user?.user?.role?.id]);

  const handleSync = async () => {
    setBanner(null);
    const merchantId = pos.square?.merchant_id;
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
            <Store className="w-8 h-8 text-[color:var(--color-primary)]"/>
          </div>
        </div>

        {/* Tight info row — only the essentials */}
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {retailer.location?.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="text-[color:var(--color-fg-muted)]">
                {retailer.location.address}
              </span>
            </div>
          )}

          {retailer.location?.phone && (
            <a href={`tel:${retailer.location.phone}`}
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Phone className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span>{retailer.location.phone}</span>
            </a>
          )}

          {retailer.location?.contactEmail && (
            <a href={`mailto:${retailer.location.contactEmail}`}
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Mail className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="underline">Email</span>
            </a>
          )}

          {retailer.location?.website && (
            <a href={retailer.location.website} target="_blank" rel="noreferrer"
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Globe className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="underline">Website</span>
            </a>
          )}
        </div>

        {/* Bottom-right sync control with text for clarity */}
        {canSync && (
          <div className="absolute bottom-4 right-4 text-right">
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`btn-minimal inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[color:var(--color-border)] hover:bg-[color:var(--color-muted)] transition ${syncing ? "opacity-80 cursor-not-allowed" : ""}`}
              title="Sync Inventory"
              aria-label="Sync Inventory"
            >
              <RefreshCcw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}/>
              <span className="text-sm">
                {syncing ? "Syncing inventory…" : "Sync Inventory"}
              </span>
            </button>
            <div className="mt-1 text-[11px] leading-snug text-[color:var(--color-fg-muted)]">
              {syncing ? "Please wait, this may take up to a minute." : ""}
            </div>
          </div>
        )}

      </div>

      {/* Inventory Table */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">{inventory.length} Wines Available</h2>
        </div>

        {banner && (
          <div
            className={`mb-4 border-2 px-4 py-3 text-sm ${
              banner.type === "success"
                ? "border-green-600/40 bg-green-500/10 text-green-700"
                : "border-red-600/40 bg-red-500/10 text-red-700"
            }`}
          >
            {banner.message}
          </div>
        )}

        {inventory.length === 0 ? (
          <div
            className="text-center py-16 text-[color:var(--color-fg-muted)] border-2 border-dashed border-[color:var(--color-border)]">
            No wines in inventory yet.
          </div>
        ) : (
          <RetailerInventoryTable wines={inventory}/>
        )}
      </div>
    </div>
  );
};