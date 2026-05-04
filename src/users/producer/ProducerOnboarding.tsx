import {useMutation, useQuery} from "@apollo/client";
import {MapPin, Search} from "lucide-react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import GoogleProfile from "../../components/GoogleProfile.tsx";
import SectionCard from "../../components/SectionCard.tsx";
import {InputField, Notice} from "../../components/ui";
import {createSessionUser, type GraphUser} from "../../auth";
import {useAuth} from "../../auth";
import {domainClient, producerClient} from "../../services/apolloClient.ts";
import {AREAS_QUERY} from "../../services/domain/domainGraph.ts";
import {ADD_PRODUCER} from "../../services/producer/producerGraph.ts";

type Area = { id: string; name: string; regionName?: string };
type DomainAreaNode = { id: string; name: string };
type DomainRegionNode = { name?: string; areas?: DomainAreaNode[] };
type DomainCountryNode = { regions?: DomainRegionNode[] };
type AreasQueryData = { Domain?: { countries?: DomainCountryNode[] } };
type SocialProvider = "FACEBOOK" | "INSTAGRAM" | "TWITTER";
type ProducerInput = {
  name: string;
  areaId: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  socialLinks?: { provider: SocialProvider; url: string }[];
};

const socialOptions: { provider: SocialProvider; label: string; placeholder: string }[] = [
  {provider: "INSTAGRAM", label: "Instagram", placeholder: "https://instagram.com/your-winery"},
  {provider: "FACEBOOK", label: "Facebook", placeholder: "https://facebook.com/your-winery"},
  {provider: "TWITTER", label: "X / Twitter", placeholder: "https://x.com/your-winery"},
];

const devProducerDefaults = import.meta.env.DEV ? {
  name: "Pearson Wine",
  email: "pearson@wine.com",
  phone: "3035207822",
  website: "http://pearson.com",
  description: "Local development producer profile.",
  socialLinks: {
    INSTAGRAM: "https://www.instagram.com/wine_graph/?hl=en",
    FACEBOOK: "",
    TWITTER: "",
  } satisfies Record<SocialProvider, string>,
} : null;

const AvaSelection: React.FC<{ value?: string | null; onChange?: (id: string) => void }> = ({
  value = null,
  onChange
}) => {
  const [query, setQuery] = useState("");
  const {data, loading, error, refetch} = useQuery<AreasQueryData>(AREAS_QUERY, {client: domainClient});
  const [selectedId, setSelectedId] = useState<string | null>(value);

  useEffect(() => {
    setSelectedId(value ?? null);
  }, [value]);

  const allAreas: Area[] = useMemo(() => {
    const result: Area[] = [];
    const countries = data?.Domain?.countries ?? [];
    countries.forEach((c) => {
      (c?.regions ?? []).forEach((r) => {
        (r?.areas ?? []).forEach((a) => {
          result.push({id: a.id, name: a.name, regionName: r?.name});
        });
      });
    });
    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allAreas.filter((a) => a.name.toLowerCase().includes(q) || a.regionName?.toLowerCase().includes(q));
  }, [query, allAreas]);
  const hasSearch = query.trim().length > 0;

  const handleChoose = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
  };

  return (
    <div className="rounded-[var(--radius-sm)] border border-token bg-[color:var(--color-panel)]">
      <div className="border-b border-token px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[color:var(--color-accent)]"/>
          <h3 className="text-base font-semibold tracking-tight">Primary area</h3>
        </div>
        <p className="mt-1 text-sm text-fg-muted">
          Select the primary area of production.
        </p>
      </div>

      <div className="p-4">
        <div>
          <label htmlFor="ava-search" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Search className="w-5 h-5 text-fg-muted" aria-hidden="true"/>
          </label>
          <InputField
            id="ava-search"
            type="text"
            placeholder="Search by AVA | AOC | DOCG | etc..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {hasSearch && (
          <div className="mt-3 max-h-56 overflow-auto border border-token rounded-[var(--radius-sm)] divide-y divide-[color:var(--color-border)]" role="listbox" aria-label="Areas">
            {loading ? (
              <div className="p-3 text-sm text-fg-muted">Loading areas...</div>
            ) : error ? (
              <div className="p-3 text-sm">
                We couldn't load areas.
                <div className="mt-2">
                  <button type="button" onClick={() => refetch()}
                          className="px-2 h-8 rounded border border-token hover:bg-[color:var(--color-muted)]">Retry
                  </button>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-sm text-fg-muted">
                That area isn't available yet. Try another AVA or region for now.
              </div>
            ) : (
              filtered.map((a) => (
                <label key={a.id} className="flex items-start gap-3 p-3 cursor-pointer transition hover:bg-[color:var(--color-muted)]">
                  <input
                    type="radio"
                    name="ava"
                    value={a.id}
                    checked={selectedId === a.id}
                    onChange={() => handleChoose(a.id)}
                    className="mt-1"
                  />
                  <span className="min-w-0">
                    <div className="font-medium text-sm">{a.name}</div>
                    {a.regionName && (
                      <div className="text-xs text-fg-muted">{a.regionName}</div>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProducerOnboarding: React.FC<{
  onSuccess: (id: string) => void;
  user: GraphUser | undefined;
}> = ({user, onSuccess}) => {
  const {clearOnboardingRole, login} = useAuth();
  const [name, setName] = useState(devProducerDefaults?.name ?? "");
  const [email, setEmail] = useState(devProducerDefaults?.email ?? "");
  const [phone, setPhone] = useState(devProducerDefaults?.phone ?? "");
  const [website, setWebsite] = useState(devProducerDefaults?.website ?? "");
  const [description, setDescription] = useState(devProducerDefaults?.description ?? "");
  const [socialLinks, setSocialLinks] = useState<Record<SocialProvider, string>>({
    INSTAGRAM: devProducerDefaults?.socialLinks.INSTAGRAM ?? "",
    FACEBOOK: devProducerDefaults?.socialLinks.FACEBOOK ?? "",
    TWITTER: devProducerDefaults?.socialLinks.TWITTER ?? "",
  });
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
    if (!areaId) return;
    if (!user) {
      setSubmitError("We couldn't find your Google session. Sign in again to continue.");
      return;
    }
    const trimmedSocialLinks = socialOptions
      .map(({provider}) => ({provider, url: socialLinks[provider].trim()}))
      .filter((link) => link.url.length > 0);

    const producerInput: ProducerInput = {
      name: name.trim(),
      areaId
    };
    const trimmedWebsite = website.trim();
    const trimmedDescription = description.trim();
    const trimmedEmail = email.trim();
    const normalizedPhone = phone.replace(/\D/g, "");

    if (trimmedWebsite) producerInput.website = trimmedWebsite;
    if (trimmedDescription) producerInput.description = trimmedDescription;
    if (trimmedEmail) producerInput.email = trimmedEmail;
    if (normalizedPhone) producerInput.phone = normalizedPhone;
    if (trimmedSocialLinks.length > 0) producerInput.socialLinks = trimmedSocialLinks;

    try {
      const res = await addProducer({
        variables: {
          producer: producerInput
        }
      });
      const createdId = res?.data?.Producer?.addProducer?.id as string | undefined;
      if (!createdId) {
        throw new Error("Producer was created without an id");
      }
      const createdUser = await createSessionUser(user, "producer", createdId);
      login(createdUser);
      clearOnboardingRole();
      onSuccess(createdId);
    } catch (err) {
      setSubmitError("We couldn't create your producer. Retry in a moment.");
      console.error("Producer onboarding failed", {
        producerInput,
        error: err,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] items-start gap-8">
      <GoogleProfile
        name={user?.name ?? ""}
        picture={user?.picture ?? ""}
        email={user?.email ?? ""}
      />
      <SectionCard cardHeader={{icon: MapPin, title: "Producer setup"}}>
        <div className="p-5 sm:p-6">
          <div className="mb-5 max-w-2xl">
            <p className="text-sm text-fg-muted">
              Add the public details Wine Graph needs to create your profile.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-name">Producer name</label>
              <InputField
                id="producer-name"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={name.trim().length === 0}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="producer-description">Description</label>
              <textarea
                id="producer-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="input-field h-28 py-2 resize-y"
                placeholder="Tell retailers and wine buyers what makes this producer distinct."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-email">Contact email</label>
              <InputField
                id="producer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-website">Website</label>
              <InputField
                id="producer-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="producer-phone">Phone (optional)</label>
              <InputField
                id="producer-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 border-t border-token pt-5">
            <div className="text-sm font-medium">Social links</div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {socialOptions.map(({provider, label, placeholder}) => (
                <div key={provider}>
                  <label className="block text-sm font-medium mb-1" htmlFor={`producer-social-${provider.toLowerCase()}`}>
                    {label}
                  </label>
                  <InputField
                    id={`producer-social-${provider.toLowerCase()}`}
                    type="url"
                    value={socialLinks[provider]}
                    placeholder={placeholder}
                    onChange={(e) => setSocialLinks((current) => ({
                      ...current,
                      [provider]: e.target.value,
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-fg-muted">We'll use contact details for account and data notifications.</p>

          <div className="mt-6">
            <AvaSelection value={areaId} onChange={(id) => setAreaId(id)}/>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-token pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-fg-muted">
              We will add your wine library/catalog next.
            </div>
            <button
              type="submit"
              disabled={!valid || loading}
              aria-disabled={!valid || loading}
              className={`btn ${valid && !loading ? "btn-primary" : "opacity-60 cursor-not-allowed"}`}
            >
              {loading ? "Saving..." : "Save and continue"}
            </button>
          </div>

          {submitError && (
            <Notice variant="error" className="mt-3 text-sm" role="alert">
              {submitError}
            </Notice>
          )}
        </div>
      </SectionCard>
    </form>
  );
};
