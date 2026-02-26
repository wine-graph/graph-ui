import {Link, useParams} from "react-router-dom";
import {useMemo} from "react";
import {useQuery} from "@apollo/client";
import {WINE_BY_ID_ENRICHED} from "../services/producer/wineGraph.ts";
import {producerClient} from "../services/apolloClient.ts";
import type {WineEnriched, WineProducer, WineRetailer} from "../users/producer/producer.ts";
import {Card, DataTable, EmptyState, SectionTitle, StatePanel} from "../components/ui";

export default function WinePage() {
  const {id} = useParams();

  const {data, loading, error, refetch} = useQuery(WINE_BY_ID_ENRICHED, {
    client: producerClient,
    variables: {id},
    skip: !id,
  });

  const wine = data?.Wine?.enriched as WineEnriched | undefined;
  const retailers = wine?.retailers as WineRetailer[] | undefined;
  const producer = wine?.producer as WineProducer | undefined;

  const subtitle = useMemo(() => {
    if (!wine) return "";
    const parts: string[] = [];
    if (wine.vintage) parts.push(String(wine.vintage));
    if (wine.varietal) parts.push(wine.varietal);
    if (wine.retailers?.length) parts.push(`${wine.retailers.length} retailers`);
    return parts.join(" • ");
  }, [wine]);

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
              <SectionTitle title="Retailers carrying this wine" titleClassName="text-[20px]" />
              {!retailers || retailers.length === 0 ? (
                <EmptyState title="No retailers listed yet." className="mt-3" />
              ) : (
                <DataTable<WineRetailer>
                  className="mt-3"
                  columns={[
                    {
                      id: "retailer",
                      header: "Retailer",
                      render: (r) => <Link className="underline underline-offset-2" to={`/retailer/${r.id}/inventory`}>{r.name}</Link>,
                    },
                  ]}
                  rows={retailers}
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
