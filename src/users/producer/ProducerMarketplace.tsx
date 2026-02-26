import PageHeader from "../../components/PageHeader.tsx";
import {ProducerCard} from "./ProducerCard.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCERS_QUERY} from "../../services/producer/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import {useMemo} from "react";
import type {Producer} from "./producer.ts";
import {StatePanel} from "../../components/ui";

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
          <StatePanel
            variant="error"
            role="alert"
            className="mb-6"
            title="We couldn’t load producers."
            desc="Retry in a moment."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-secondary focus-accent"
              >
                Retry
              </button>
            }
          />
        ) : loading ? (
          <StatePanel title="Loading producers..." align="center" className="py-20" />
        ) : producers.length === 0 ? (
          <StatePanel
            title="No producers yet"
            desc="Producers will appear here as they join Wine Graph."
            align="center"
            variant="empty"
            className="py-20"
          />
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
