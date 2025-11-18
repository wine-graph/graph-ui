import PageHeader from "../../components/common/PageHeader.tsx";
import {ProducerCard} from "./ProducerCard.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCERS_QUERY} from "../../services/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import {useMemo} from "react";
import type {Producer} from "./producer.ts";

export const ProducerMarketplace = () => {
  const {data, loading} = useQuery(PRODUCERS_QUERY, {client: producerClient});
  const producers = useMemo(() => (data?.Producer?.producers as Producer[]) ?? [], [data]);

  return (
    <div className="mt-10">
      <PageHeader
        title="Producer Marketplace"
        desc="Discover and connect with premium wine producers. Source exceptional wines directly."
      />

      <section className="mt-12">
        {loading ? (
          <div className="text-center py-20 text-muted">Loading producers…</div>
        ) : producers.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <p className="text-xl font-semibold text-fg-muted mb-3">
                No producers yet
              </p>
              <p className="text-muted">
                We're onboarding exceptional producers daily. Check back soon!
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