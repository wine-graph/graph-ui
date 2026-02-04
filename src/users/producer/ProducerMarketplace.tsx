import PageHeader from "../../components/PageHeader.tsx";
import {ProducerCard} from "./ProducerCard.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCERS_QUERY} from "../../services/producer/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import {useMemo} from "react";
import type {Producer} from "./producer.ts";

export const ProducerMarketplace = () => {
  const {data, loading, error, refetch} = useQuery(PRODUCERS_QUERY, {client: producerClient});
  const producers = useMemo(() => (data?.Producer?.all as Producer[]) ?? [], [data]);

  return (
    <div className="mt-10">
      <PageHeader
        title="Producer marketplace"
        desc="Browse and connect with producers across Wine Graph."
      />

      <section className="mt-12">
        {error ? (
          <div className="mb-6 border border-[color:var(--color-border)] rounded-md p-4 bg-[color:var(--color-neutral-100)]">
            <p className="text-body text-fg">We couldn’t load producers. Retry in a moment.</p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="px-3 py-2 text-sm border border-[color:var(--color-border)] rounded hover:bg-[color:var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-fg)]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-muted">Loading producers…</div>
        ) : producers.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <p className="text-xl font-semibold text-fg-muted mb-3">
                No producers yet
              </p>
              <p className="text-muted">
                Producers will appear here as they join Wine Graph.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {producers.map((producer) => (
              <ProducerCard key={producer.id} {...producer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};