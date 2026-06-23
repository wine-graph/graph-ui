import {useMutation, useQuery} from "@apollo/client";
import {Check, ImagePlus, MapPin, Search, X} from "lucide-react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {InputField, Notice} from "../../components/ui";
import {createSessionUser, type GraphUser} from "../../auth";
import {useAuth} from "../../auth";
import GoogleProfile from "../../components/GoogleProfile.tsx";
import {domainClient, producerClient} from "../../services/apolloClient.ts";
import {PRODUCER_ONBOARDING_AREAS_QUERY} from "../../services/domain/domainGraph.ts";
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
  logo?: number[];
};

const maxLogoBytes = 512 * 1024;

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
    FACEBOOK: "https://www.facebook.com/winegraph/",
    TWITTER: "",
  } satisfies Record<SocialProvider, string>,
} : null;

const getErrorMessage = (err: unknown) => err instanceof Error ? err.message : "Unknown error";

const AvaSelection: React.FC<{ value?: string | null; onChange?: (id: string | null) => void }> = ({
  value = null,
  onChange
}) => {
  const [query, setQuery] = useState("");
  const {data, loading, error, refetch} = useQuery<AreasQueryData>(PRODUCER_ONBOARDING_AREAS_QUERY, {client: domainClient});
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
    const areas = q
      ? allAreas.filter((a) => a.name.toLowerCase().includes(q) || a.regionName?.toLowerCase().includes(q))
      : allAreas;
    return areas
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [query, allAreas]);

  const selectedArea = useMemo(() => allAreas.find((area) => area.id === selectedId) ?? null, [allAreas, selectedId]);

  const handleChoose = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
    const area = allAreas.find((item) => item.id === id);
    if (area) setQuery(area.name);
  };

  const clearSelection = () => {
    setSelectedId(null);
    setQuery("");
    onChange?.(null);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="ava-search" className="block text-sm font-medium mb-1">
          Primary area
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" aria-hidden="true"/>
          <input
            id="ava-search"
            type="text"
            //placeholder="Search AVA, AOC, DOCG, region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-9 pr-10"
          />
          {(query || selectedId) && (
            <button
              type="button"
              onClick={clearSelection}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-fg-muted hover:bg-[color:var(--color-muted)]"
              aria-label="Clear selected area"
            >
              <X className="h-4 w-4" aria-hidden="true"/>
            </button>
          )}
        </div>
      </div>

      {selectedArea && (
        <div className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] p-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-accent)]" aria-hidden="true"/>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{selectedArea.name}</div>
            {selectedArea.regionName && (
              <div className="truncate text-xs text-fg-muted">{selectedArea.regionName}</div>
            )}
          </div>
        </div>
      )}

      <div className="max-h-72 overflow-auto rounded-[var(--radius-sm)] border border-token divide-y divide-[color:var(--color-border)]" role="listbox" aria-label="Areas">
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
    </div>
  );
};

const LogoPicker: React.FC<{
  logoPreviewUrl: string | null;
  logoFileName: string;
  logoError: string | null;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLogo: () => void;
}> = ({logoPreviewUrl, logoFileName, logoError, logoInputRef, onLogoChange, onClearLogo}) => (
  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="producer-logo">Logo</label>
    <div className="flex gap-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-token bg-[color:var(--color-muted)] flex-center">
        {logoPreviewUrl ? (
          <img src={logoPreviewUrl} alt="Selected producer logo preview" className="h-full w-full object-contain p-1" />
        ) : (
          <ImagePlus className="h-8 w-8 text-fg-muted" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={logoInputRef}
            id="producer-logo"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={onLogoChange}
            className="sr-only"
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => logoInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {logoPreviewUrl ? "Change" : "Upload"}
          </button>
          {logoPreviewUrl && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClearLogo}
              aria-label="Remove logo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {logoFileName ? (
          <div className="mt-2 truncate text-xs text-fg-muted">{logoFileName}</div>
        ) : (
          <div className="mt-2 text-xs text-fg-muted">PNG, JPG, SVG, or WebP up to 512 KB.</div>
        )}
        {logoError && (
          <Notice variant="error" className="mt-2 text-sm" role="alert">
            {logoError}
          </Notice>
        )}
      </div>
    </div>
  </div>
);

export const ProducerOnboarding: React.FC<{
  onSuccess: (id: string, slug?: string) => void;
  onChangeRole: () => void;
  user: GraphUser | undefined;
}> = ({user, onSuccess, onChangeRole}) => {
  const {clearOnboardingRole, login} = useAuth();
  const [name, setName] = useState(devProducerDefaults?.name ?? "");
  const [email, setEmail] = useState(devProducerDefaults?.email ?? "");
  const [phone, setPhone] = useState(devProducerDefaults?.phone ?? "");
  const [website, setWebsite] = useState(devProducerDefaults?.website ?? "");
  const [description, setDescription] = useState(devProducerDefaults?.description ?? "");
  const [logo, setLogo] = useState<number[]>([]);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoError, setLogoError] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<SocialProvider, string>>({
    INSTAGRAM: devProducerDefaults?.socialLinks.INSTAGRAM ?? "",
    FACEBOOK: devProducerDefaults?.socialLinks.FACEBOOK ?? "",
    TWITTER: devProducerDefaults?.socialLinks.TWITTER ?? "",
  });
  const [areaId, setAreaId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addProducer, {loading}] = useMutation(ADD_PRODUCER, {client: producerClient});

  const nameRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const valid = name.trim().length > 1 && !!areaId;

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLogoError("Choose a PNG, JPG, SVG, or WebP logo file.");
      e.target.value = "";
      return;
    }

    if (file.size > maxLogoBytes) {
      setLogoError("Choose a logo smaller than 512 KB.");
      e.target.value = "";
      return;
    }

    const buffer = await file.arrayBuffer();
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogo(Array.from(new Int8Array(buffer)));
    setLogoPreviewUrl(URL.createObjectURL(file));
    setLogoFileName(file.name);
  };

  const clearLogo = () => {
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogo([]);
    setLogoPreviewUrl(null);
    setLogoFileName("");
    setLogoError(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

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
    if (logo.length > 0) producerInput.logo = logo;

    try {
      const res = await addProducer({
        variables: {
          producer: producerInput
        }
      });
      const createdId = res?.data?.Producer?.addProducer?.id as string | undefined;
      const createdSlug = res?.data?.Producer?.addProducer?.slug as string | undefined;
      if (!createdId) {
        throw new Error("Producer was created without an id");
      }
      const createdUser = await createSessionUser(user, "producer", createdId);
      login(createdUser);
      clearOnboardingRole();
      onSuccess(createdId, createdSlug);
    } catch (err) {
      setSubmitError(`We couldn't create your producer. ${getErrorMessage(err)}`);
      console.error("Producer onboarding failed", {
        producerInput: {
          ...producerInput,
          logo: producerInput.logo ? `[${producerInput.logo.length} bytes]` : undefined,
        },
        error: err,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-[var(--radius-sm)] border border-token bg-[color:var(--color-panel)] shadow-xl shadow-black/5">
        <div className="border-b border-token p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[color:var(--color-accent)]" aria-hidden="true"/>
                <h2 className="text-xl font-semibold tracking-tight">Producer setup</h2>
              </div>
              <p className="mt-2 text-sm text-fg-muted">
                Add the public profile details buyers and retailers will see first.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <GoogleProfile
                variant="compact"
                name={user?.name ?? ""}
                picture={user?.picture ?? ""}
                email={user?.email ?? ""}
              />
              <button type="button" className="btn btn-secondary shrink-0" onClick={onChangeRole}>
                Change role
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
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
                  rows={8}
                  className="input-field min-h-48 py-2 resize-y leading-6"
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

            <div className="border-t border-token pt-5">
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
          </div>

          <aside className="space-y-6 lg:border-l lg:border-token lg:pl-6">
            <LogoPicker
              logoPreviewUrl={logoPreviewUrl}
              logoFileName={logoFileName}
              logoError={logoError}
              logoInputRef={logoInputRef}
              onLogoChange={handleLogoChange}
              onClearLogo={clearLogo}
            />
            <AvaSelection value={areaId} onChange={(id) => setAreaId(id)}/>
          </aside>
        </div>

        <div className="border-t border-token p-5 sm:p-6">
          {submitError && (
            <Notice variant="error" className="mb-4 text-sm" role="alert">
              {submitError}
            </Notice>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-fg-muted">
              We will add your portfolio next.
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
        </div>
      </div>
    </form>
  );
};
