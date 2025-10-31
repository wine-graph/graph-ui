import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import L, {type LatLngBoundsExpression, type LatLngExpression} from 'leaflet'
import {useEffect} from "react";
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

interface MapViewProps {
  center: LatLngExpression;
  zoom?: number;
  markers?: { position: LatLngExpression, label?: string }[];
}

export const MapView = ({center, zoom = 13, markers = []}: MapViewProps) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{height: '500px', width: '100%'}}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>

      {markers.map((m, i) => (
        <Marker key={i} position={m.position}>
          {m.label && <Popup>{m.label}</Popup>}
        </Marker>
      ))}
      <FitBounds
        positions={[
          center as [number, number],
          ...markers.map((r) => r.position as [number, number]),
        ]}
      />
    </MapContainer>
  );
};

interface FitBoundsProps {
  positions: [number, number][];
}

const FitBounds = ({positions}: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;
    const bounds: LatLngBoundsExpression = L.latLngBounds(positions);
    map.fitBounds(bounds, {padding: [100, 100]});
  }, [positions, map]);

  return null;
};