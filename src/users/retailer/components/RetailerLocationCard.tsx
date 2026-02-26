import {Globe, Mail, MapPin, Phone, Store} from "lucide-react";
import type {ReactNode} from "react";
import type {Retailer} from "../retailer.ts";
import {Card, SectionTitle} from "../../../components/ui";

type Props = {
  retailer: Retailer;
  children?: ReactNode;
  className?: string;
};

export const RetailerLocationCard = ({retailer, children, className = ""}: Props) => {
  return (
    <Card className={`p-6 mb-8 relative ${className}`}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <SectionTitle eyebrow="Retailer" title={retailer.name} titleClassName="text-[32px] tracking-tight truncate" />
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-1.5">
            {retailer.location?.city && `${retailer.location.city}, `}
            {retailer.location?.state}
            {retailer.location?.zipCode && ` ${retailer.location.zipCode}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Store className="w-7 h-7 text-[color:var(--color-accent)]"/>
        </div>
      </div>

      {children}

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        {retailer.location?.address && (
          <div className="hidden md:flex items-center gap-2.5">
            <MapPin className="w-4.5 h-4.5 text-[color:var(--color-accent)]"/>
            <span className="text-[color:var(--color-fg-muted)]">
              {retailer.location.address}
            </span>
          </div>
        )}

        {retailer.location?.phone && (
          <a href={`tel:${retailer.location.phone}`}
             className="flex items-center gap-2.5 transition hover:text-[color:var(--color-accent)]">
            <Phone className="w-4.5 h-4.5 text-[color:var(--color-accent)]"/>
            <span>{retailer.location.phone}</span>
          </a>
        )}

        {retailer.location?.contactEmail && (
          <a href={`mailto:${retailer.location.contactEmail}`}
             className="hidden md:flex items-center gap-2.5 transition hover:text-[color:var(--color-accent)]">
            <Mail className="w-4.5 h-4.5 text-[color:var(--color-accent)]"/>
            <span className="underline">Email</span>
          </a>
        )}

        {retailer.location?.website && (
          <a href={retailer.location.website} target="_blank" rel="noreferrer"
             className="hidden md:flex items-center gap-2.5 transition hover:text-[color:var(--color-accent)]">
            <Globe className="w-4.5 h-4.5 text-[color:var(--color-accent)]"/>
            <span className="underline">Website</span>
          </a>
        )}
      </div>
    </Card>
  );
};

export default RetailerLocationCard;
