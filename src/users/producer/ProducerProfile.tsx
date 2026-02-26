import PageHeader from "../../components/PageHeader.tsx";
import GoogleProfile from "../../components/GoogleProfile.tsx";
import SectionCard from "../../components/SectionCard.tsx";
import {MapPin} from "lucide-react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import type {User} from "../../auth";
import {useAuth} from "../../auth";
import {useMutation, useQuery} from "@apollo/client";
import {AREAS_QUERY} from "../../services/domain/domainGraph.ts";
import {domainClient, producerClient} from "../../services/apolloClient.ts";
import {ADD_PRODUCER, PRODUCER_BY_ID} from "../../services/producer/producerGraph.ts";
import {useNavigate} from "react-router-dom";

// Monochrome, minimal Producer profile page.
// Purpose: let producers confirm basic profile and select their primary AVA/area.
export const ProducerProfile: React.FC = () => {
  const {user, isProducer} = useAuth();
  const navigate = useNavigate();

  // Prefer URL param if present; fallback to role.id from auth
  const producerId = user?.user.role?.id;
  console.info("[producer] producerId from auth:", producerId);
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

      {/* Page-level states for producer existence */}
      {loading ? (
        <div className="mt-10 text-center text-sm text-slate-600">Loading profile…</div>
      ) : (data?.Producer?.producer ? (
        // Existing producer: show summary + area selection module
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Google profile summary */}
          <GoogleProfile
            name={user?.user.name ?? ""}
            picture={user?.user.picture ?? ""}
            email={user?.user.email ?? ""}
          />
        </div>
      ) : (
        // No producer yet — onboarding form
        <OnboardingForm
          onSuccess={(newId: string) => navigate(`/producer/${newId}/profile`)}
          user={user?.user}
        />
      ))}
    </div>
  );
};

type Area = { id: string; name: string; regionName?: string };

const AvaSelection: React.FC<{ value?: string | null; onChange?: (id: string) => void }> = ({
                                                                                              value = null,
                                                                                              onChange
                                                                                            }) => {
  const [query, setQuery] = useState("");
  const {data, loading, error, refetch} = useQuery(AREAS_QUERY, {client: domainClient});
  const [selectedId, setSelectedId] = useState<string | null>(value);

  useEffect(() => {
    setSelectedId(value ?? null);
  }, [value]);

  // Flatten areas from countries → regions → areas
  const allAreas: Area[] = useMemo(() => {
    const result: Area[] = [];
    const countries = data?.Domain?.countries ?? [];
    countries.forEach((c: any) => {
      (c?.regions ?? []).forEach((r: any) => {
        (r?.areas ?? []).forEach((a: any) => {
          result.push({id: a.id, name: a.name, regionName: r?.name});
        })
      })
    });
    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = allAreas;
    if (!q) return base;
    return base.filter((a) => a.name.toLowerCase().includes(q) || a.regionName?.toLowerCase().includes(q));
  }, [query, allAreas]);

  const handleChoose = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
  };

  return (
    <SectionCard cardHeader={{icon: MapPin, title: "Primary area"}}>
      <div className="p-6">
        <p className="text-sm text-slate-600 mb-4">
          Select the AVA or area where you primarily produce. You can update this later in settings.
        </p>

        {/* Search */}
        <div className="mb-3">
          <label htmlFor="ava-search" className="block text-sm font-medium mb-2">
            Search areas
          </label>
          <input
            id="ava-search"
            type="text"
            placeholder="Search AVAs or regions…"
            className="w-full border rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-black/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="max-h-64 overflow-auto border rounded-md divide-y" role="listbox" aria-label="Areas">
          {loading ? (
            <div className="p-3 text-sm text-slate-600">Loading areas…</div>
          ) : error ? (
            <div className="p-3 text-sm">
              We couldn’t load areas.
              <div className="mt-2">
                <button type="button" onClick={() => refetch()}
                        className="px-2 h-8 rounded border hover:bg-neutral-100">Retry
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-sm text-slate-600">No results match your search.</div>
          ) : (
            filtered.map((a) => (
              <label key={a.id} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-neutral-100">
                <input
                  type="radio"
                  name="ava"
                  value={a.id}
                  checked={selectedId === a.id}
                  onChange={() => handleChoose(a.id)}
                  className="mt-1"
                />
                <span>
                  <div className="font-medium text-sm">{a.name}</div>
                  {a.regionName && (
                    <div className="text-xs text-slate-600">{a.regionName}</div>
                  )}
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  );
};

// Onboarding form shown when PRODUCER_BY_ID returns null
const OnboardingForm: React.FC<{ onSuccess: (id: string) => void, user: User | undefined }> = ({user}) => {
  const {clearLocalRole} = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [areaId, setAreaId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addProducer, {loading}] = useMutation(ADD_PRODUCER, {client: producerClient});

  const nameRef = useRef<HTMLInputElement | null>(null);

  const valid = name.trim().length > 1 && areaId != null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!valid) {
      setSubmitError("Provide a name and select an area.");
      nameRef.current?.focus();
      return;
    }
    try {
      const vars = {
        producer: {
          name: name.trim(),
          email: email || undefined,
          phone: phone || undefined,
          website: website || undefined,
          areaId
        }
      } as any;
      const res = await addProducer({variables: vars});
      const created = res?.data?.Producer?.addProducer;
      console.info("[producer] created ", created);
      clearLocalRole();
    } catch (err) {
      setSubmitError("We couldn’t create your producer. Retry in a moment.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Google Account summary */}
      <GoogleProfile
        name={user?.name ?? ""}
        picture={user?.picture ?? ""}
        email={user?.email ?? ""}
      />
      {/* Right: Onboarding fields */}
      <SectionCard cardHeader={{icon: MapPin, title: "Set up your producer"}}>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-name">Producer name</label>
              <input
                id="producer-name"
                ref={nameRef}
                type="text"
                className="w-full border rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-black/60"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={name.trim().length === 0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-email">Contact email</label>
              <input
                id="producer-email"
                type="email"
                className="w-full border rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-black/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-slate-600 mt-1">We’ll use this for account and data notifications.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-phone">Phone (optional)</label>
              <input
                id="producer-phone"
                type="tel"
                className="w-full border rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-black/60"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-website">Website (optional)</label>
              <input
                id="producer-website"
                type="url"
                className="w-full border rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-black/60"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* Area selection */}
          <div className="mt-6">
            <AvaSelection value={areaId} onChange={(id) => setAreaId(id)}/>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={!valid || loading}
              aria-disabled={!valid || loading}
              className={`px-3 h-10 rounded-md border transition active:scale-[0.98] ${valid && !loading ? "hover:bg-neutral-100" : "opacity-60 cursor-not-allowed"}`}
            >
              {loading ? "Saving…" : "Save and continue"}
            </button>
          </div>

          {submitError && (
            <div className="mt-3 text-sm text-red-700 border border-red-300 rounded p-2">
              {submitError}
            </div>
          )}
        </div>
      </SectionCard>
    </form>
  );
};

export default ProducerProfile;
