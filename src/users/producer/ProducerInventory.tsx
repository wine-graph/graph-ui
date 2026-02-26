import React, {useMemo} from "react";
import {useAuth} from "../../auth";
import PageHeader from "../../components/PageHeader.tsx";
import ProducerWinesImport from "./import/ProducerWinesImport.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCER_BY_ID} from "../../services/producer/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import type {Wine} from "./producer.ts";
import {Link} from "react-router-dom";
import {ActionRow, Card, DataTable, EmptyState, SectionTitle, SkeletonPanel, StatePanel} from "../../components/ui";

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
          <Card className="p-4 sm:p-5">
            <ActionRow>
              <SectionTitle title="Your wines" titleClassName="text-[16px] font-medium" />
              <div className="text-[13px] text-muted">
                {loading ? "Loading…" : `${wines.length} item${wines.length === 1 ? "" : "s"}`}
              </div>
            </ActionRow>

            {/* Table states */}
            {error ? (
              <StatePanel
                variant="error"
                role="alert"
                title="We couldn’t load wines."
                desc="Retry in a moment or refresh the page."
                className="mt-3"
                action={
                  <button className="btn btn-secondary" onClick={() => refetch()}>Retry</button>
                }
              />
            ) : loading ? (
              <SkeletonPanel className="mt-4 p-4">
                <div className="h-8 bg-token/50 border border-token rounded-[var(--radius-sm)] mb-2" />
                <div className="space-y-2">
                  <div className="h-10 bg-token/30 border border-token rounded" />
                  <div className="h-10 bg-token/30 border border-token rounded" />
                  <div className="h-10 bg-token/30 border border-token rounded" />
                </div>
              </SkeletonPanel>
            ) : wines.length === 0 ? (
              <EmptyState
                title="No wines yet"
                desc="Upload a CSV to add wines to your catalog."
                className="mt-3 border-none text-left py-2 px-0"
              />
            ) : (
              <DataTable<Wine>
                className="mt-4"
                columns={[
                  {
                    id: "name",
                    header: "Name",
                    render: (w) => (w.slug && w.id)
                      ? <Link className="underline underline-offset-2" to={`/wine/${w.slug}/${w.id}`}>{w.name}</Link>
                      : <span>{w.name}</span>,
                  },
                  {id: "vintage", header: "Vintage", render: (w) => w.vintage ?? "—"},
                  {id: "varietal", header: "Varietal", render: (w) => w.varietal ?? "—"},
                ]}
                rows={wines}
                rowKey={(w) => w.slug || w.id || w.name}
              />
            )}
          </Card>
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
