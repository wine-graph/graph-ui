import {Building2, ChevronRight, Globe, Mail, Phone, Wine} from "lucide-react";
import type {Producer} from "./producer.ts";

export const ProducerCard: React.FC<Producer> = ({name, description, wines = [], email, phone, website}) => {
  const wineCount = wines.length;
  const featuredWines = wines.slice(0, 3).map(w => w.name).filter(Boolean);
  const moreCount = wineCount - featuredWines.length;

  const hasEmail = !!email?.trim();
  const hasPhone = !!phone?.trim();
  const hasWebsite = !!website?.trim();

  return (
    <div
      className="group relative panel-token border border-[color:var(--color-border)] rounded-xl p-6 hover:border-[color:var(--color-primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Subtle accent ring on hover */}
      <div
        className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-[color:var(--color-accent)]/20 transition-all pointer-events-none"/>

      <div className="relative space-y-5">
        {/* Header with icon + name */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[color:var(--color-muted)] flex-center">
              <Building2 className="w-7 h-7 text-[color:var(--color-primary)]"/>
            </div>
            <h3 className="text-xl font-bold text-[color:var(--color-fg)] leading-tight">
              {name}
            </h3>
          </div>
          <ChevronRight
            className="w-5 h-5 text-[color:var(--color-fg-muted)] group-hover:text-[color:var(--color-primary)] group-hover:translate-x-1 transition-all"/>
        </div>

        {/* Description */}
        {description && (
          <p className="text-body text-fg-muted line-clamp-3">
            {description}
          </p>
        )}

        {/* Wine count + preview */}
        <div className="text-sm">
          <span className="font-semibold text-[color:var(--color-primary)]">
            <Wine className="w-4.5 h-4.5"/> {wineCount} {wineCount === 1 ? "wine" : "wines"}
          </span>
          {featuredWines.length > 0 && (
            <span className="text-fg-muted">
              {" · "} {featuredWines.join(", ")}
              {moreCount > 0 && ` +${moreCount} more`}
            </span>
          )}
        </div>

        {/* Icon-only contact bar — exactly like your Retailer tiles */}
        {(hasEmail || hasPhone || hasWebsite) && (
          <div className="flex items-center gap-8 pt-5 border-t border-[color:var(--color-border)] border-opacity-40">
            {hasWebsite && (
              <a
                href={website?.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary)] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Visit website"
              >
                <Globe className="w-5 h-5"/>
              </a>
            )}
            {hasEmail && (
              <a
                href={`mailto:${email}`}
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary)] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Send email"
              >
                <Mail className="w-5 h-5"/>
              </a>
            )}
            {hasPhone && (
              <a
                href={`tel:${phone?.replace(/[^\d+]/g, "")}`}
                className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary)] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Call"
              >
                <Phone className="w-5 h-5"/>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};