import {Link, useParams} from "react-router-dom";
import {useMemo} from "react";
import {useQuery} from "@apollo/client";
import {producerClient} from "../services/apolloClient";
import {PRODUCER_BY_ID_ENRICHED} from "../services/producer/producerGraph.ts";
import type {Producer} from "../users/producer/producer.ts";

function SkeletonRow() {
  return (
    <div className="animate-pulse h-5 bg-neutral-200 rounded"/>
  );
}

export default function ProducerPage() {
  const {id} = useParams();
  const {data, loading, error, refetch} = useQuery(PRODUCER_BY_ID_ENRICHED, {
    client: producerClient,
    variables: {id},
    skip: !id,
  });

  const producer = data?.Producer?.enriched as Producer | undefined;

  const headerSubtitle = useMemo(() => {
    if (!producer) return "";
  }, [producer]);

  return (
    <main className="px-4 sm:px-6 md:px-8 py-4" aria-labelledby="page-title">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-2">
        <ol className="flex gap-2">
          <li><Link className="underline-offset-2 hover:underline" to="/">Wine Graph</Link></li>
          <li>/</li>
          <li>Producers</li>
          <li>/</li>
          <li className="text-neutral-900 truncate max-w-[50vw]" aria-current="page">{producer?.name || producer?.slug}</li>
        </ol>
      </nav>

      {/* Header band */}
      <header className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 id="page-title"
              className="text-2xl text-neutral-900 font-medium leading-tight">{producer?.name || (loading ? "Loading…" : producer?.slug)}</h1>
          {headerSubtitle && (
            <p className="text-sm text-neutral-700 mt-1">{headerSubtitle}</p>
          )}
        </div>
        {/* Right side role-aware placeholder */}
        <div className="flex items-center gap-2">
          {/* Placeholder for role-aware controls; keep monochrome */}
        </div>
      </header>

      {/* Page states */}
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
            <p className="text-neutral-900">We couldn’t load this producer. Retry in a moment.</p>
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

      {(!loading && !error && producer) && (
        <div className="mt-6 space-y-6">
          {/* Overview + In the graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overview card */}
            <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="overview-title">
              <h2 id="overview-title" className="text-lg font-medium text-neutral-900">Overview</h2>
              <div className="mt-3 divide-y divide-neutral-200">
                {(producer.description && producer.description.length > 0) && (
                  <div className="py-2">
                    <div className="text-neutral-700">Description</div>
                    <div className="text-neutral-900 text-sm mt-1">{producer.description}</div>
                  </div>
                )}
                {producer.website && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-neutral-700">Website</span>
                    <a className="text-neutral-900 underline underline-offset-2" href={producer.website} target="_blank"
                       rel="noreferrer">Visit</a>
                  </div>
                )}
                {producer.phone && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-neutral-700">Phone</span>
                    <a className="text-neutral-900 underline underline-offset-2" href={`tel:${producer.phone}`}>{producer.phone}</a>
                  </div>
                )}
                {producer.email && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-neutral-700">Email</span>
                    <a className="text-neutral-900 underline underline-offset-2" href={`mailto:${producer.email}`}>{producer.email}</a>
                  </div>
                )}
              </div>
            </section>

            {/* In the graph card */}
            <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="graph-title">
              <h2 id="graph-title" className="text-lg font-medium text-neutral-900">In the graph</h2>
              <ul className="mt-3 space-y-2 text-neutral-900">
                <li>{producer?.wines?.length ?? "—"} wines in Wine Graph</li>
                <li>Located in # {producer.areas?.length ?? "0"} areas (AVA, AOC, etc)</li>
                <li>Added to Wine Graph: {producer.createdAt ? new Date(producer.createdAt).getFullYear() : "—"}</li>
              </ul>
            </section>
          </div>

          {/* Wines + Retailers row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wines list/table */}
            <section className="md:col-span-2 bg-white border border-neutral-200 rounded p-4"
                     aria-labelledby="wines-title">
              <h2 id="wines-title" className="text-lg font-medium text-neutral-900">Wines from this producer</h2>
              <div className="mt-3">
                {(!producer.wines || producer.wines.length === 0) ? (
                  <p className="text-neutral-700">No wines for this producer in Wine Graph yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-neutral-700">
                      <tr>
                        <th className="py-2 pr-4">Wine</th>
                        <th className="py-2 pr-4">Vintage</th>
                        <th className="py-2 pr-4">Varietal</th>
                      </tr>
                      </thead>
                      <tbody className="border-t border-neutral-200 text-neutral-900">
                      {producer.wines.map((w) => (
                        <tr key={w.slug || w.id || w.name} className="border-b border-neutral-200 last:border-b-0">
                          <td className="py-2 pr-4">
                            {(w.slug && w.id) ? (
                              <Link className="underline underline-offset-2" to={`/wine/${w.slug}/${w.id}`}>{w.name}</Link>
                            ) : (
                              <span>{w.name}</span>
                            )}
                          </td>
                          <td className="py-2 pr-4">{w.vintage ?? "—"}</td>
                          <td className="py-2 pr-4">{w.varietal ?? "—"}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Data section */}
          <section className="bg-white border border-neutral-200 rounded p-4" aria-labelledby="data-title">
            <h2 id="data-title" className="text-lg font-medium text-neutral-900">Data</h2>
            <p className="text-neutral-700 mt-2">Data completeness, corrections, and history will appear here.</p>
          </section>
        </div>
      )}
    </main>
  );
}
