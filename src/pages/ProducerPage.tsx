import {Link, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {producerClient} from "../services/apolloClient";
import {PRODUCER_PUBLIC_PAGE_QUERY} from "../services/producer/producerGraph.ts";
import type {Producer} from "../users/producer/producer.ts";
import {Card, DataTable, EmptyState, SectionTitle, StatePanel} from "../components/ui";
import ProducerLogo from "../users/producer/ProducerLogo.tsx";
import ContactLinks from "../components/ContactLinks.tsx";
import {winePath} from "../app/routes.ts";

const formatBio = (description?: string) => description
  ?.replace(/\r\n/g, "\n")
  .split(/\n{2,}/)
  .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim())
  .filter(Boolean);

export default function ProducerPage() {
  const {slug} = useParams();
  const {data, loading, error, refetch} = useQuery(PRODUCER_PUBLIC_PAGE_QUERY, {
    client: producerClient,
    variables: {slug},
    skip: !slug,
  });

  const producer = data?.Producer?.producerBySlug as Producer | undefined;
  const bioParagraphs = formatBio(producer?.description);
  const hasConnectLinks = Boolean(producer?.website || producer?.email || producer?.phone || producer?.social?.length);

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <ProducerLogo
              logo={producer?.logo}
              name={producer?.name}
              className="h-16 w-16 sm:h-20 sm:w-20"
              iconClassName="h-9 w-9"
            />
            <h1 id="page-title" className="text-heading-page">{producer?.name || (loading ? "Loading..." : "Producer")}</h1>
          </div>

          {hasConnectLinks && (
            <div className="flex flex-col gap-2 lg:items-end">
              <div className="text-xs uppercase tracking-[0.16em] text-fg-muted">Connect with us</div>
              <ContactLinks
                website={producer?.website}
                email={producer?.email}
                phone={producer?.phone}
                social={producer?.social}
              />
            </div>
          )}
        </div>
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <Card className="p-5 sm:p-6">
              <SectionTitle title="Our Story" titleClassName="text-[20px]" />
              {bioParagraphs?.length ? (
                <div className="mt-4 max-w-4xl space-y-4 text-base leading-7 text-token">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-fg-muted">No producer bio has been added yet.</p>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <SectionTitle title="In the graph" titleClassName="text-[20px]" />
                <span className="w-fit rounded-[var(--radius-sm)] border border-token px-2 py-1 text-xs uppercase tracking-[0.12em] text-fg-muted">
                  Coming soon...
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-[var(--radius-sm)] border border-token bg-[color:var(--color-bg)] p-3">
                  <div className="text-2xl font-semibold">{producer.wineCount ?? producer.wines?.length ?? 0}</div>
                  <div className="mt-1 text-xs text-fg-muted">Wines</div>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-token bg-[color:var(--color-bg)] p-3">
                  <div className="text-2xl font-semibold">{producer.createdAt ? new Date(producer.createdAt).getFullYear() : "-"}</div>
                  <div className="mt-1 text-xs text-fg-muted">Joined</div>
                </div>
              </div>
              <div className="mt-4 divide-y divide-token overflow-hidden rounded-[var(--radius-sm)] border border-token">
                {[
                  {label: "Retailers carrying this producer", value: "Coming soon"},
                  {label: "Saved by users", value: "Coming soon"},
                ].map((item) => (
                  <div key={item.label} className="bg-[color:var(--color-bg)] p-3">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="mt-1 text-xs text-fg-muted">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <SectionTitle title="Current Portfolio" titleClassName="text-[20px]" />
            {!producer.wines || producer.wines.length === 0 ? (
              <EmptyState title="No wines for this producer yet." className="mt-3" />
            ) : (
              <DataTable
                className="mt-3"
                columns={[
                  {
                    id: "wine",
                    header: "Wine",
                    render: (w) => {
                      const href = winePath(w);
                      return href
                        ? <Link className="underline underline-offset-2" to={href}>{w.name}</Link>
                        : <span>{w.name}</span>;
                    },
                  },
                  {id: "vintage", header: "Vintage", render: (w) => w.vintage ?? "-"},
                  {id: "varietal", header: "Varietal", render: (w) => w.varietal ?? "-"},
                ]}
                rows={producer.wines}
                rowKey={(w) => w.slug || w.id || w.name}
              />
            )}
          </Card>

          {/*<Card className="p-4">*/}
          {/*  <SectionTitle title="Data" titleClassName="text-[20px]" />*/}
          {/*  <p className="text-fg-muted mt-2">Data completeness, corrections, and history will appear here.</p>*/}
          {/*</Card>*/}
        </div>
      )}
    </main>
  );
}
