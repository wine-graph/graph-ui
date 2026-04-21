import L from "leaflet";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationState = "checking" | "prompt" | "granted" | "denied" | "unsupported";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 5 * 60 * 1000,
};

const MILES_PER_METER = 0.000621371;

const getBrowserLocation = (): Promise<Coordinates> => new Promise((resolve, reject) => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    reject(new Error("unsupported"));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => reject(error),
    GEOLOCATION_OPTIONS,
  );
});

const getGeolocationPermission = async (): Promise<LocationState> => {
  if (typeof navigator === "undefined" || !navigator.geolocation) return "unsupported";
  if (!navigator.permissions?.query) return "prompt";

  try {
    const status = await navigator.permissions.query({name: "geolocation"} as PermissionDescriptor);
    if (status.state === "granted") return "granted";
    if (status.state === "denied") return "denied";
    return "prompt";
  } catch {
    return "prompt";
  }
};

const watchGeolocationPermission = async (
  onChange: (state: LocationState) => void,
): Promise<(() => void) | undefined> => {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) return undefined;

  try {
    const status = await navigator.permissions.query({name: "geolocation"} as PermissionDescriptor);
    const sync = () => {
      if (status.state === "granted") onChange("granted");
      else if (status.state === "denied") onChange("denied");
      else onChange("prompt");
    };

    sync();
    status.onchange = sync;

    return () => {
      status.onchange = null;
    };
  } catch {
    return undefined;
  }
};

const getLocationStateFromError = (error: GeolocationPositionError | Error): LocationState => {
  if ("message" in error && error.message === "unsupported") return "unsupported";
  if ("code" in error && error.code === error.PERMISSION_DENIED) return "denied";
  return "prompt";
};

const getDistanceMiles = (from: Coordinates, to: Coordinates): number => {
  const meters = L.latLng(from.latitude, from.longitude)
    .distanceTo(L.latLng(to.latitude, to.longitude));
  return meters * MILES_PER_METER;
};

const formatDistanceMiles = (miles: number): string => miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`;

const getLocationMessage = (
  state: LocationState,
  hasRetailers: boolean,
  hasUserCoordinates: boolean,
): string | null => {
  if (!hasRetailers) return null;
  if (hasUserCoordinates) return "Sorted by distance from your current location.";
  if (state === "checking") return "Checking location permission…";
  if (state === "prompt") return "Allow location to see distance to each retailer.";
  if (state === "denied") return "Location access is blocked in your browser settings.";
  if (state === "unsupported") return "Distance is unavailable in this browser.";
  return null;
};

export {
  formatDistanceMiles,
  getBrowserLocation,
  getDistanceMiles,
  getGeolocationPermission,
  getLocationMessage,
  getLocationStateFromError,
  watchGeolocationPermission,
};

export type {Coordinates, LocationState};
