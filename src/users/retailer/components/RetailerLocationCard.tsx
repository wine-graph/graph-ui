import {Globe, Mail, MapPin, Phone, Store} from "lucide-react";
import type {ReactNode} from "react";
import type {Retailer} from "../retailer.ts";

type Props = {
  retailer: Retailer;
  children?: ReactNode;
  className?: string;
};

export const RetailerLocationCard = ({retailer, children, className = ""}: Props) => {
  return (
    <div className={`border-2 border-[color:var(--color-border)] bg-panel-token p-5 mb-8 relative ${className}`}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black tracking-tight truncate">
            {retailer.name}
          </h1>
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
            {retailer.location?.city && `${retailer.location.city}, `}
            {retailer.location?.state}
            {retailer.location?.zipCode && ` ${retailer.location.zipCode}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Store className="w-8 h-8 text-neutral-900"/>
        </div>
      </div>

      {children}

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        {retailer.location?.address && (
          <div className="hidden md:flex items-center gap-2.5">
            <MapPin className="w-4.5 h-4.5 text-neutral-900"/>
            <span className="text-[color:var(--color-fg-muted)]">
              {retailer.location.address}
            </span>
          </div>
        )}

        {retailer.location?.phone && (
          <a href={`tel:${retailer.location.phone}`}
             className="flex items-center gap-2.5 transition">
            <Phone className="w-4.5 h-4.5 text-neutral-900"/>
            <span>{retailer.location.phone}</span>
          </a>
        )}

        {retailer.location?.contactEmail && (
          <a href={`mailto:${retailer.location.contactEmail}`}
             className="hidden md:flex items-center gap-2.5 transition">
            <Mail className="w-4.5 h-4.5 text-neutral-900"/>
            <span className="underline">Email</span>
          </a>
        )}

        {retailer.location?.website && (
          <a href={retailer.location.website} target="_blank" rel="noreferrer"
             className="hidden md:flex items-center gap-2.5 transition">
            <Globe className="w-4.5 h-4.5 text-neutral-900"/>
            <span className="underline">Website</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default RetailerLocationCard;
