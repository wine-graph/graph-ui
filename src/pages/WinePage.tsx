import {Link, useParams} from "react-router-dom";
import {useMemo} from "react";
import {useQuery} from "@apollo/client";
import {WINE_BY_ID_ENRICHED} from "../services/producer/wineGraph.ts";
import {producerClient} from "../services/apolloClient.ts";
import type {WineEnriched, WineProducer, WineRetailer} from "../users/producer/producer.ts";

function SkeletonRow() {
  return <div className="animate-pulse h-5 bg-neutral-200 rounded"/>;
}

export default function WinePage() {
  const {id} = useParams();

  const {data, loading, error, refetch} = useQuery(WINE_BY_ID_ENRICHED, {client: producerClient, variables: {id}, skip: !id});
  const wine = data?.Wine?.enriched as WineEnriched | undefined;
  const retailers = wine?.retailers as WineRetailer[] | undefined;
  const producer = wine?.producer as WineProducer | undefined;

  const subtitle = useMemo(() => {
    if (!wine) return "";
    const parts: string[] = [];
    if (wine.vintage) parts.push(String(wine.vintage));
    if (producer?.name) parts.push(producer.name);
    if (wine.retailers?.length) parts.push(`${wine.retailers.length} retailers`);
    return parts.join(" • ");
  }, [wine, producer?.name]);

  return (
    <main className="px-4 sm:px-6 md:px-8 py-4" aria-labelledby="page-title">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-2">
        <ol className="flex gap-2">
          <li><Link className="underline-offset-2 hover:underline" to="/">Wine Graph</Link></li>
          <li>/</li>
          <li>Wines</li>
          <li>/</li>
          <li className="text-neutral-900 truncate max-w-[50vw]" aria-current="page">{wine?.name || wine?.slug}</li>
        </ol>
      </nav>

      {/* Header band */}
      <header className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 id="page-title"
              className="text-2xl text-neutral-900 font-medium leading-tight">{wine?.name || (loading ? "Loading…" : wine?.slug)}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-700 mt-1">
              {producer ? (
                <>
                  <span className="mx-1">•</span>
                  <Link className="underline underline-offset-2"
                        to={`/producer/${(producer.slug)}/${producer.id}`}>{producer.name}</Link>
                </>
              ) : null}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {wine?.createdAt && (
            <span className="text-sm text-neutral-700">In Wine Graph since {new Date(wine.createdAt).getFullYear()}</span>
          )}
        </div>
      </header>

      {/* States */}
      {loading && (
        <section className="mt-6">
          <div className="space-y-2 max-w-md">
            <SkeletonRow/>
            <SkeletonRow/>
            <SkeletonRow/>
          </div>
        </section>
      )}
      {error && (
        <section className="mt-6" role="alert" aria-live="polite">
          <div className="border border-neutral-300 bg-white p-3 rounded">
            <p className="text-neutral-900">We couldn’t load this wine. Retry in a moment.</p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="px-3 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {(!loading && !error && wine) && (
        <div className="mt-6 space-y-6">
          {/* Profile + In the graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile */}
            <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="profile-title">
              <h2 id="profile-title" className="text-lg font-medium text-neutral-900">Profile</h2>
              <div className="mt-3 divide-y divide-neutral-200">
                {wine?.producer && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-neutral-700">Producer</span>
                    <Link className="text-neutral-900 underline underline-offset-2"
                          to={`/producer/${(producer?.slug)}/${producer?.id}`}>{producer?.name}</Link>
                  </div>
                )}
                {wine.vintage && (
                  <div className="py-2 flex items-center justify-between"><span
                    className="text-neutral-700">Vintage</span><span className="text-neutral-900">{wine.vintage}</span>
                  </div>
                )}
                {(wine.varietal) && (
                  <div className="py-2 flex items-center justify-between"><span
                    className="text-neutral-700">Varietal</span><span
                    className="text-neutral-900">{wine.varietal}</span></div>
                )}
                {wine.description && (
                  <div className="py-2">
                    <div className="text-neutral-700">Notes</div>
                    <p className="text-neutral-900 text-sm mt-1">{wine.description}</p></div>
                )}
              </div>
            </section>

            {/* In the graph */}
            <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="ingraph-title">
              <h2 id="ingraph-title" className="text-lg font-medium text-neutral-900">In the graph</h2>
              <p className="text-[14px] text-muted text-center">Coming soon...</p>
              {/* Role-aware examples (text only, no branching layout) */}
              <p
                className="text-sm text-neutral-700 mt-2">{/* Retailer/Producer context could show here in the future. */}</p>
            </section>
          </div>

          {/* Retailers + Similar wines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Retailers carrying this wine */}
            <section className="md:col-span-2 bg-white border border-neutral-200 rounded p-4 outline-none"
                     aria-labelledby="retailers-title">
              <h2 id="retailers-title" className="text-lg font-medium text-neutral-900">Retailers carrying this
                wine</h2>
              <div className="mt-3">
                {retailers?.length === 0 ? (
                  <p className="text-neutral-700">No retailers listed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-neutral-700">
                      <tr>
                        <th className="py-2 pr-4">Retailer</th>
                      </tr>
                      </thead>
                      <tbody className="border-t border-neutral-200 text-neutral-900">
                      {retailers?.map((r, i) => (
                        <tr key={i} className="border-b border-neutral-200 last:border-b-0">
                          <td className="py-2 pr-4">
                            {
                              <Link className="underline underline-offset-2" to={`/${r.id}/inventory`}>
                                {r.name}
                              </Link>
                            }
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Similar wines */}
            <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="similar-title">
              <h2 id="similar-title" className="text-lg font-medium text-neutral-900">Similar wines</h2>
              <p className="text-[14px] text-muted text-center">Coming soon...</p>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
