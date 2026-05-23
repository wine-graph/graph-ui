import {useQuery} from "@apollo/client";
import React from "react";
import GoogleProfile from "../../components/GoogleProfile.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import {useAuth} from "../../auth";
import {producerClient} from "../../services/apolloClient.ts";
import {PRODUCER_BY_ID} from "../../services/producer/producerGraph.ts";

export const ProducerProfile: React.FC = () => {
  const {user, isProducer} = useAuth();
  const producerId = isProducer ? user?.role?.id : undefined;
  const {data, loading} = useQuery(PRODUCER_BY_ID, {
    variables: {id: producerId},
    client: producerClient,
    skip: !producerId,
    fetchPolicy: "cache-first",
  });

  if (!isProducer) {
    return (
      <div className="p-8 text-center text-red-600">Access denied. Producer only.</div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader
        title="Producer profile"
        desc="Confirm your details and set your primary area of production."
      />

      {loading ? (
        <div className="mt-10 text-center text-sm text-fg-muted">Loading profile...</div>
      ) : data?.Producer?.producer ? (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] items-start gap-8">
          <GoogleProfile
            name={user?.name ?? ""}
            picture={user?.picture ?? ""}
            email={user?.email ?? ""}
          />
        </div>
      ) : (
        <div className="mt-10 text-center text-sm text-fg-muted">
          We couldn't load your producer profile.
        </div>
      )}
    </div>
  );
};

export default ProducerProfile;
