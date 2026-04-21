import {Link, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@apollo/client";
import {WINE_BY_ID_ENRICHED} from "../services/producer/wineGraph.ts";
import {producerClient, retailerClient} from "../services/apolloClient.ts";
import type {WineEnriched, WineProducer, WineRetailer} from "../users/producer/producer.ts";
import {Card, DataTable, EmptyState, SectionTitle, StatePanel} from "../components/ui";
import {RETAILER_COORDINATES_QUERY} from "../services/retailer/retailerGraph.ts";
import {
  formatDistanceMiles,
  getBrowserLocation,
  getDistanceMiles,
  getGeolocationPermission,
  getLocationMessage,
  getLocationStateFromError,
  watchGeolocationPermission,
} from "../lib/location.ts";
import type {Coordinates, LocationState} from "../lib/location.ts";

type RetailerDistanceRow = WineRetailer & {
  distanceMiles: number | null;
  distanceLabel: string | null;
};

export default function WinePage() {
  const {id} = useParams();
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("checking");
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [retailerCoordinatesById, setRetailerCoordinatesById] = useState<Record<string, Coordinates>>({});

  const {data, loading, error, refetch} = useQuery(WINE_BY_ID_ENRICHED, {
    client: producerClient,
    variables: {id},
    skip: !id,
  });

  const wine = data?.Wine?.enriched as WineEnriched | undefined;
  const retailers = wine?.retailers as WineRetailer[] | undefined;
  const producer = wine?.producer as WineProducer | undefined;

  useEffect(() => {
    const readUserLocation = async () => {
      setIsRequestingLocation(true);
      try {
        const coordinates = await getBrowserLocation();
        setUserCoordinates(coordinates);
        setLocationState("granted");
      } catch (geoError) {
        setLocationState(getLocationStateFromError(geoError as GeolocationPositionError | Error));
      } finally {
        setIsRequestingLocation(false);
      }
    };

    let cancelled = false;
    let stopWatching: (() => void) | undefined;

    void getGeolocationPermission().then((state) => {
      if (cancelled) return;
      setLocationState(state);
      if (state === "granted") void readUserLocation();
    });

    void watchGeolocationPermission((state) => {
      if (cancelled) return;
      setLocationState(state);
      if (state === "granted") void readUserLocation();
    }).then((cleanup) => {
      stopWatching = cleanup;
    });

    return () => {
      cancelled = true;
      stopWatching?.();
    };
  }, []);

  useEffect(() => {
    if (!retailers?.length) {
      setRetailerCoordinatesById({});
      return;
    }

    let cancelled = false;

    const loadRetailerCoordinates = async () => {
      const results = await Promise.allSettled(
        retailers.map(async (retailer) => {
          const response = await retailerClient.query({
            query: RETAILER_COORDINATES_QUERY,
            variables: {id: retailer.id},
            fetchPolicy: "no-cache",
          });

          const coordinates = response.data?.Retailer?.retailer?.location?.coordinates as Coordinates | undefined;
          if (
            coordinates?.latitude == null ||
            coordinates?.longitude == null
          ) {
            return null;
          }

          return [retailer.id, coordinates] as const;
        }),
      );

      if (cancelled) return;

      const nextCoordinates = results.reduce<Record<string, Coordinates>>((acc, result) => {
        if (result.status !== "fulfilled" || !result.value) return acc;
        const [retailerId, coordinates] = result.value;
        acc[retailerId] = coordinates;
        return acc;
      }, {});

      setRetailerCoordinatesById(nextCoordinates);
    };

    void loadRetailerCoordinates();

    return () => {
      cancelled = true;
    };
  }, [retailers]);

  const requestUserLocation = () => {
    setIsRequestingLocation(true);
    void getBrowserLocation()
      .then((coordinates) => {
        setUserCoordinates(coordinates);
        setLocationState("granted");
      })
      .catch((geoError) => {
        setLocationState(getLocationStateFromError(geoError as GeolocationPositionError | Error));
      })
      .finally(() => {
        setIsRequestingLocation(false);
      });
  };

  const subtitle = useMemo(() => {
    if (!wine) return "";
    const parts: string[] = [];
    if (wine.vintage) parts.push(String(wine.vintage));
    if (wine.varietal) parts.push(wine.varietal);
    if (wine.retailers?.length) parts.push(`${wine.retailers.length} retailers`);
    return parts.join(" • ");
  }, [wine]);

  const retailerRows = useMemo(() => {
    if (!retailers?.length) return [];

    const rows = retailers.map((retailer) => {
      const retailerCoordinates = retailerCoordinatesById[retailer.id];
      const distanceMiles = userCoordinates && retailerCoordinates
        ? getDistanceMiles(userCoordinates, retailerCoordinates)
        : null;

      return {
        ...retailer,
        distanceMiles,
        distanceLabel: distanceMiles == null ? null : formatDistanceMiles(distanceMiles),
      } satisfies RetailerDistanceRow;
    });

    if (!userCoordinates) return rows;

    return [...rows].sort((a, b) => {
      if (a.distanceMiles == null && b.distanceMiles == null) return 0;
      if (a.distanceMiles == null) return 1;
      if (b.distanceMiles == null) return -1;
      return a.distanceMiles - b.distanceMiles;
    });
  }, [retailerCoordinatesById, retailers, userCoordinates]);

  const locationMessage = useMemo(() => {
    return getLocationMessage(locationState, Boolean(retailers?.length), Boolean(userCoordinates));
  }, [locationState, retailers?.length, userCoordinates]);

  return (
    <main className="container-max py-6 sm:py-8" aria-labelledby="page-title">
      <nav aria-label="Breadcrumb" className="text-sm text-fg-muted mb-3">
        <ol className="flex gap-2">
          <li><Link className="underline-offset-2 hover:underline" to="/">Wine Graph</Link></li>
          <li>/</li>
          <li>Wines</li>
          <li>/</li>
          <li className="text-token truncate max-w-[50vw]" aria-current="page">{wine?.name || "Wine"}</li>
        </ol>
      </nav>

      <header className="border-b border-token pb-4">
        <h1 id="page-title" className="text-heading-page">{wine?.name || (loading ? "Loading..." : "Wine")}</h1>
        <div className="text-sm text-fg-muted mt-2 flex flex-wrap gap-3">
          {subtitle ? <span>{subtitle}</span> : null}
          {producer ? (
            <Link className="underline underline-offset-2" to={`/producer/${producer.slug}/${producer.id}`}>
              {producer.name}
            </Link>
          ) : null}
          {wine?.createdAt ? <span>In Wine Graph since {new Date(wine.createdAt).getFullYear()}</span> : null}
        </div>
      </header>

      {loading && (
        <section className="mt-6">
          <StatePanel title="Loading wine..." variant="loading" />
        </section>
      )}

      {error && (
        <section className="mt-6">
          <StatePanel
            variant="error"
            role="alert"
            title="We couldn’t load this wine."
            desc="Retry in a moment."
            action={<button type="button" onClick={() => refetch()} className="btn btn-secondary focus-accent">Retry</button>}
          />
        </section>
      )}

      {(!loading && !error && wine) && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <SectionTitle title="Profile" titleClassName="text-[20px]" />
              <div className="mt-3 divide-y divide-token/80">
                {wine?.producer ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Producer</span>
                    <Link className="underline underline-offset-2" to={`/producer/${producer?.slug}/${producer?.id}`}>{producer?.name}</Link>
                  </div>
                ) : null}
                {wine.vintage ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Vintage</span>
                    <span>{wine.vintage}</span>
                  </div>
                ) : null}
                {wine.varietal ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Varietal</span>
                    <span>{wine.varietal}</span>
                  </div>
                ) : null}
                {wine.description ? (
                  <div className="py-2">
                    <div className="text-fg-muted">Notes</div>
                    <p className="text-sm mt-1">{wine.description}</p>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card className="p-4">
              <SectionTitle title="In the graph" titleClassName="text-[20px]" />
              <p className="text-[14px] text-muted mt-2">Coming soon...</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <SectionTitle title="Find this wine near you" titleClassName="text-[20px]" />
                  {locationMessage ? (
                    <p className="mt-2 text-[13px] text-fg-muted">{locationMessage}</p>
                  ) : null}
                </div>
                {locationState === "prompt" && retailers?.length ? (
                  <button
                    type="button"
                    className="btn btn-secondary focus-accent self-start"
                    onClick={requestUserLocation}
                    disabled={isRequestingLocation}
                  >
                    {isRequestingLocation ? "Locating…" : "Use my location"}
                  </button>
                ) : null}
              </div>
              {!retailers || retailers.length === 0 ? (
                <EmptyState title="No retailers listed yet." className="mt-3" />
              ) : (
                <DataTable<RetailerDistanceRow>
                  className="mt-3"
                  columns={[
                    {
                      id: "retailer",
                      header: "Retailer",
                      render: (r) => <Link className="underline underline-offset-2" to={`/retailer/${r.id}/inventory`}>{r.name}</Link>,
                    },
                    {
                      id: "distance",
                      header: "Distance",
                      headerClassName: "w-[120px]",
                      render: (r) => r.distanceLabel ?? "—",
                      cellClassName: "whitespace-nowrap text-fg-muted",
                    },
                  ]}
                  rows={retailerRows}
                  rowKey={(r, i) => r.id || `${r.name}-${i}`}
                />
              )}
            </Card>

            <Card className="p-4">
              <SectionTitle title="Similar wines" titleClassName="text-[20px]" />
              <p className="text-[14px] text-muted mt-2">Coming soon...</p>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
