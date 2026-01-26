import React, {useMemo} from "react";
import {useAuth} from "../../auth";
import PageHeader from "../../components/PageHeader.tsx";
import ProducerWinesImport from "./import/ProducerWinesImport.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCER_BY_ID} from "../../services/producer/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import type {Wine} from "./producer.ts";
import {Link} from "react-router-dom";

const ProducerInventory: React.FC = () => {
  const {user} = useAuth();
  const producerId = user?.user.role.id;

  const {data, loading, error, refetch} = useQuery(PRODUCER_BY_ID, {
    variables: {id: producerId},
    client: producerClient,
    skip: !producerId,
    fetchPolicy: "cache-first",
  });

  const wines = useMemo(() => {
    const arr = data?.Producer?.producer?.wines ?? [];
    // Defensive: ensure array of items with id/name
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  return (
    <main className="container-max py-6 sm:py-8" id="main">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader
          title="Inventory"
          desc="View your current wines and upload more to your catalog."
        />

        {/* Inventory table (List + Detail scaffold) */}
        <section className="mt-6">
          <div className="panel-token border border-token rounded-[var(--radius-md)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-medium">Your wines</h2>
              <div className="text-[13px] text-muted">
                {loading ? "Loading…" : `${wines.length} item${wines.length === 1 ? "" : "s"}`}
              </div>
            </div>

            {/* Table states */}
            {error ? (
              <div className="mt-3 border border-token rounded-[var(--radius-sm)] p-3" role="alert">
                <div className="text-[14px] font-medium">We couldn’t load wines.</div>
                <div className="text-[13px] text-muted mt-1">Retry in a moment or refresh the page.</div>
                <div className="mt-2">
                  <button className="btn btn-secondary" onClick={() => refetch()}>Retry</button>
                </div>
              </div>
            ) : loading ? (
              <div className="mt-4">
                <div className="h-8 bg-token/50 border border-token rounded-[var(--radius-sm)] animate-pulse" />
                <div className="mt-2 space-y-2">
                  <div className="h-10 bg-token/30 border border-token rounded" />
                  <div className="h-10 bg-token/30 border border-token rounded" />
                  <div className="h-10 bg-token/30 border border-token rounded" />
                </div>
              </div>
            ) : wines.length === 0 ? (
              <div className="mt-3">
                <div className="text-[14px] font-medium">No wines yet</div>
                <div className="text-[13px] text-muted mt-1">Upload a CSV to add wines to your catalog.</div>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2 px-2 border-b border-token">Name</th>
                      <th className="py-2 px-2 border-b border-token">Vintage</th>
                      <th className="py-2 px-2 border-b border-token">Varietal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wines.map((w: Wine) => (
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

        {/* Import section */}
        <section className="mt-6">
          <ProducerWinesImport producerId={producerId ?? ""} />
        </section>
      </div>
    </main>
  );
};

export default ProducerInventory;
