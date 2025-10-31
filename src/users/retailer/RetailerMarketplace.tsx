import {useEffect, useMemo, useState} from "react";
import {RetailerCard} from "./RetailerCard.tsx";
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

  // Get the user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const {latitude, longitude} = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Error getting location:", err);
        // fallback position (e.g., New York)
        setPosition([40.7128, -74.006]);
      }
    );
  }, []);

  // Don't render map until we have a position
  if (!position) return <p>Loading map...</p>;

  const retailerMarkers =
    retailers.filter((r) => r.location?.coordinates)
      .map((r) => {
        return {
          position: [r.location?.coordinates?.latitude, r.location?.coordinates?.longitude] as LatLngExpression,
          label: r.name ?? "Unnamed Retailer",
        };
      }) ?? [];

  retailerMarkers.forEach(m => console.log(m.label, m.position));

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Explore Retailers</h2>
        <MapView center={position} zoom={13} markers={retailerMarkers}/>
      </div>

      {loading ? (
        <div className="">Loading retailers…</div>
      ) : retailers.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-8 text-center text-textSecondary">
          No retailers to display.
        </div>
      ) : (
        <div className="retailers grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {retailers.map((retailer) => (
            <RetailerCard key={retailer.id} {...retailer} />
          ))}
        </div>
      )}
    </div>
  );
}