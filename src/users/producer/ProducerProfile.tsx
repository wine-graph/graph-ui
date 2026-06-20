import {useQuery} from "@apollo/client";
import React from "react";
import PageHeader from "../../components/PageHeader.tsx";
import {useAuth} from "../../auth";
import {producerClient} from "../../services/apolloClient.ts";
import {PRODUCER_PROFILE_QUERY} from "../../services/producer/producerGraph.ts";
import {Card, SectionTitle} from "../../components/ui";
import ProducerLogo from "./ProducerLogo.tsx";
import type {Producer} from "./producer.ts";
import ContactLinks from "../../components/ContactLinks.tsx";
import GoogleProfile from "../../components/GoogleProfile.tsx";

export const ProducerProfile: React.FC = () => {
  const {user, isProducer} = useAuth();
  const producerId = user?.role?.id;
  const {data, loading} = useQuery(PRODUCER_PROFILE_QUERY, {
    variables: {id: producerId},
    client: producerClient,
    skip: !isProducer || !producerId,
    fetchPolicy: "cache-first",
  });
  const producer = data?.Producer?.producer as Producer | undefined;

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
      ) : producer ? (
        <div className="mt-8 max-w-4xl">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-token p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-fg-muted">Profile</div>
                <div className="mt-1 text-lg font-semibold">Producer details</div>
              </div>
              <GoogleProfile
                variant="compact"
                name={user?.name ?? ""}
                email={user?.email ?? ""}
                picture={user?.picture ?? ""}
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <ProducerLogo
                  logo={producer.logo}
                  name={producer.name}
                  className="h-20 w-20"
                  iconClassName="h-9 w-9"
                />
                <div className="min-w-0 flex-1">
                  <SectionTitle title={producer.name} titleClassName="text-[24px]"/>
                  <ContactLinks
                    website={producer.website}
                    email={producer.email}
                    phone={producer.phone}
                    social={producer.social}
                    className="mt-5"
                  />
                </div>
              </div>
            </div>
          </Card>
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
