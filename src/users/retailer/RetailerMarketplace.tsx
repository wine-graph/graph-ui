import {useEffect, useMemo, useState} from "react";
import {RetailerTile} from "./RetailerTile.tsx";
import {type Retailer} from "./retailer.ts";
import {useQuery} from "@apollo/client";
import {RETAILERS_QUERY} from "../../services/retailerGraph.ts";
import {retailerClient} from "../../services/apolloClient.ts";
import {MapView} from "../../components/MapView.tsx";
import type {LatLngExpression} from "leaflet";

export const RetailerMarketplace = () => {
  const {data, loading} = useQuery(RETAILERS_QUERY, {client: retailerClient});
  const retailers = useMemo(() => (data?.Retailer?.retailers as Retailer[]) ?? [], [data]);

  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([40.7128, -74.0060])
    );
  }, []);

  const markers = retailers
    .filter((r) => r.location?.coordinates)
    .map((r) => ({
      position: [r.location!.coordinates!.latitude, r.location!.coordinates!.longitude] as LatLngExpression,
      label: r.name,
    }));

  if (!position) return <div className="p-8 text-center">Loading map…</div>;

  return (
    <div className="py-2">
      {/* Compact Retailer List at Top */}
      <div className="py-6">
        <h2 className="text-2xl font-bold mb-6">Nearby Retailers</h2>

        {loading ? (
          <p className="text-center py-12">Loading retailers…</p>
        ) : retailers.length === 0 ? (
          <p className="text-center py-12 text-[color:var(--color-fg-muted)]">No retailers found nearby.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {retailers.map((r) => (
              <RetailerTile key={r.id} {...r} />
            ))}
          </div>
        )}
      </div>

      {/* Full-bleed, perfectly filling map */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] border-2 border-[color:var(--color-border)] overflow-hidden">
        <MapView center={position} zoom={13} markers={markers} />
      </div>
    </div>
  );
};