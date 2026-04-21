import {useEffect, useMemo, useState} from "react";
import {RetailerTile} from "./RetailerTile.tsx";
import {type Retailer} from "./retailer.ts";
import {useQuery} from "@apollo/client";
import {RETAILERS_QUERY} from "../../services/retailer/retailerGraph.ts";
import {retailerClient} from "../../services/apolloClient.ts";
import {MapView} from "../../components/MapView.tsx";
import type {LatLngExpression} from "leaflet";
import {Card, SectionTitle, StatePanel} from "../../components/ui";

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

  // Build map markers, guarding against missing or null coordinates (allow 0 values)
  const markers = retailers
    .filter((r) =>
      r.location?.coordinates?.latitude !== undefined &&
      r.location?.coordinates?.latitude !== null &&
      r.location?.coordinates?.longitude !== undefined &&
      r.location?.coordinates?.longitude !== null
    )
    .map((r) => {
      const {latitude, longitude} = r.location!.coordinates!;
      return {
        position: [latitude as number, longitude as number] as LatLngExpression,
        label: r.name,
      };
    });

  if (!position) return <StatePanel title="Loading map..." align="center" className="py-12" />;

  return (
    <div className="py-2">
      {/* Compact Retailer List at Top */}
      <Card className="p-6 sm:p-8">
        <SectionTitle eyebrow="Local results" title="Nearby Retailers" className="mb-6" />

        {loading ? (
          <StatePanel title="Loading retailers..." align="center" className="py-12" />
        ) : retailers.length === 0 ? (
          <StatePanel title="No retailers found nearby." align="center" variant="empty" className="py-12" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {retailers.map((r) => (
              <RetailerTile key={r.id} {...r} />
            ))}
          </div>
        )}
      </Card>

      {/* Full-bleed, perfectly filling map */}
      <div
        className="relative w-full mt-5 h-[60vh] sm:h-[70vh] lg:h-[80vh] border border-[color:var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-soft)]">
        <MapView center={position} zoom={13} markers={markers}/>
      </div>
    </div>
  );
};
