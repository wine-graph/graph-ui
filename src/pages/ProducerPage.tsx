import {Link, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {producerClient} from "../services/apolloClient";
import {PRODUCER_BY_ID_ENRICHED} from "../services/producer/producerGraph.ts";
import type {Producer} from "../users/producer/producer.ts";
import {Card, DataTable, EmptyState, SectionTitle, StatePanel} from "../components/ui";

export default function ProducerPage() {
  const {id} = useParams();
  const {data, loading, error, refetch} = useQuery(PRODUCER_BY_ID_ENRICHED, {
    client: producerClient,
    variables: {id},
    skip: !id,
  });

  const producer = data?.Producer?.enriched as Producer | undefined;

  return (
    <main className="container-max py-6 sm:py-8" aria-labelledby="page-title">
      <nav aria-label="Breadcrumb" className="text-sm text-fg-muted mb-3">
        <ol className="flex gap-2">
          <li><Link className="underline-offset-2 hover:underline" to="/">Wine Graph</Link></li>
          <li>/</li>
          <li>Producers</li>
          <li>/</li>
          <li className="text-token truncate max-w-[50vw]" aria-current="page">{producer?.name || "Producer"}</li>
        </ol>
      </nav>

      <header className="border-b border-token pb-4">
        <h1 id="page-title" className="text-heading-page">{producer?.name || (loading ? "Loading..." : "Producer")}</h1>
      </header>

      {loading && (
        <section className="mt-6">
          <StatePanel title="Loading producer..." variant="loading" />
        </section>
      )}

      {error && (
        <section className="mt-6">
          <StatePanel
            variant="error"
            role="alert"
            title="We couldn’t load this producer."
            desc="Retry in a moment."
            action={<button type="button" onClick={() => refetch()} className="btn btn-secondary focus-accent">Retry</button>}
          />
        </section>
      )}

      {(!loading && !error && producer) && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <SectionTitle title="Overview" titleClassName="text-[20px]" />
              <div className="mt-3 divide-y divide-token/80">
                {producer.description ? (
                  <div className="py-2">
                    <div className="text-fg-muted">Description</div>
                    <div className="text-sm mt-1">{producer.description}</div>
                  </div>
                ) : null}
                {producer.website ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Website</span>
                    <a className="underline underline-offset-2" href={producer.website} target="_blank" rel="noreferrer">Visit</a>
                  </div>
                ) : null}
                {producer.phone ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Phone</span>
                    <a className="underline underline-offset-2" href={`tel:${producer.phone}`}>{producer.phone}</a>
                  </div>
                ) : null}
                {producer.email ? (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-fg-muted">Email</span>
                    <a className="underline underline-offset-2" href={`mailto:${producer.email}`}>{producer.email}</a>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card className="p-4">
              <SectionTitle title="In the graph" titleClassName="text-[20px]" />
              <ul className="mt-3 space-y-2">
                <li>{producer?.wines?.length ?? 0} wines in Wine Graph</li>
                <li>Located in {producer.areas?.length ?? 0} areas (AVA, AOC, etc.)</li>
                <li>Added to Wine Graph: {producer.createdAt ? new Date(producer.createdAt).getFullYear() : "-"}</li>
              </ul>
            </Card>
          </div>

          <Card className="p-4">
            <SectionTitle title="Wines from this producer" titleClassName="text-[20px]" />
            {!producer.wines || producer.wines.length === 0 ? (
              <EmptyState title="No wines for this producer yet." className="mt-3" />
            ) : (
              <DataTable
                className="mt-3"
                columns={[
                  {
                    id: "wine",
                    header: "Wine",
                    render: (w) => (w.slug && w.id)
                      ? <Link className="underline underline-offset-2" to={`/wine/${w.slug}/${w.id}`}>{w.name}</Link>
                      : <span>{w.name}</span>,
                  },
                  {id: "vintage", header: "Vintage", render: (w) => w.vintage ?? "-"},
                  {id: "varietal", header: "Varietal", render: (w) => w.varietal ?? "-"},
                ]}
                rows={producer.wines}
                rowKey={(w) => w.slug || w.id || w.name}
              />
            )}
          </Card>

          <Card className="p-4">
            <SectionTitle title="Data" titleClassName="text-[20px]" />
            <p className="text-fg-muted mt-2">Data completeness, corrections, and history will appear here.</p>
          </Card>
        </div>
      )}
    </main>
  );
}
