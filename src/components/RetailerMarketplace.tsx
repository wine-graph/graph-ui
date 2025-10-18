import {useEffect, useRef} from "react";
import {RetailerCard} from "./RetailerCard.tsx";
import {mockRetailer, type Retailer} from "../types/Retailer.ts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Leaflet default
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
// Assign as default for all markers
L.Marker.prototype.options.icon = defaultIcon;

/**
 * Retailer Marketplace component used for most user types
 * //todo @param userType
 */
export const RetailerMarketplace = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const getMarkerCoords = (r: Retailer): [number, number] | null => {
    const coords = r.location?.coordinates;
    if (!coords) return null;
    const { latitude, longitude } = coords;
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return null;
    }
    return [latitude, longitude];
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Default center over continental US
    const defaultCenter: [number, number] = [37.8, -96.0];
    const map = L.map(mapRef.current).setView(defaultCenter, 4);

    // Grayscale/light basemap (CartoDB Positron)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      }
    ).addTo(map);

    // Add markers where we have known coords
    const markers: L.Marker[] = [];
    mockRetailer.forEach((r) => {
      const coords = getMarkerCoords(r);
      if (coords) {
        const marker = L.marker(coords).addTo(map);
        const name = r.name;
        const city = r.location?.city;
        const state = r.location?.state;
        marker.bindPopup(`<strong>${name}</strong><br/>${city}, ${state}`);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Explore Retailers</h2>
        <div
          ref={mapRef}
          id="retailer-map"
          className="w-full rounded"
          style={{height: "360px", border: "1px solid #e5e7eb"}}
        />
      </div>

      <div className="retailers grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockRetailer.map((retailer) => (
          <RetailerCard key={retailer.id} {...retailer} />
        ))}
      </div>
    </div>
  );
}