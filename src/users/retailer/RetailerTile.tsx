import {Package} from "lucide-react";
import {type Retailer} from "./retailer.ts";
import {useNavigate} from "react-router-dom";

export const RetailerTile: React.FC<Retailer> = (retailer) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/retailer/${retailer.id}/inventory`)}
      className="w-full text-left p-5 border border-[color:var(--color-border)] bg-panel-token hover:bg-[color:var(--color-muted)] transition-all duration-200 group rounded-[var(--radius-md)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[16px] truncate group-hover:text-[color:var(--color-accent)]">
            {retailer.name}
          </h3>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-1.5">
            {`${retailer.location?.city} ${retailer.location?.state}, `}
            {`${retailer.location?.address}, ${retailer.location?.zipCode}`}
          </p>
        </div>
        <div className="btn-minimal text-xs shrink-0 group-hover:text-[color:var(--color-accent)]">
          <Package/>
        </div>
      </div>
    </button>
  );
};
