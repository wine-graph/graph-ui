import {ChevronRight, MapPin, Package, Store} from "lucide-react";
import {type Retailer} from "./retailer.ts";
import {useNavigate} from "react-router-dom";
import ContactLinks from "../../components/ContactLinks.tsx";

const formatPos = (pos?: string) => {
  if (!pos) return "Retail partner";
  return pos
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

export const RetailerCard: React.FC<Retailer> = (retailer) => {
  const navigate = useNavigate();
  const location = retailer.location;
  const cityState = [location?.city, location?.state].filter(Boolean).join(", ");
  const street = [location?.address, location?.zipCode].filter(Boolean).join(" ");
  const inventoryCount = retailer.inventoryCount ?? retailer.inventory?.length ?? 0;

  const handleOpen = () => {
    if (retailer.id) navigate(`/retailer/${retailer.id}/inventory`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      className="group relative panel-token border border-border rounded-lg p-5 hover:bg-muted hover:shadow-(--shadow-soft) hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-fg-muted">
              <Store className="h-4 w-4" aria-hidden="true" />
              {formatPos(retailer.pos)}
            </div>
            <h3 className="mt-2 text-xl font-bold leading-tight text-(--color-fg) group-hover:text-[color:var(--color-accent)] transition-colors">
              {retailer.name}
            </h3>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-(--color-fg-muted) group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>

        {(cityState || street) && (
          <div className="flex items-start gap-2 text-sm text-fg-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div>
              {cityState ? <div className="font-medium text-token">{cityState}</div> : null}
              {street ? <div className="mt-1 text-xs">{street}</div> : null}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border border-opacity-40 pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-fg)">
            <Package className="h-4 w-4" aria-hidden="true" />
            {inventoryCount > 0 ? `${inventoryCount} wines in-stock` : "Inventory available"}
          </span>
        </div>

        <ContactLinks
          website={location?.website}
          email={location?.contactEmail}
          phone={location?.phone}
          className="border-t border-border border-opacity-40 pt-4"
          onLinkClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
