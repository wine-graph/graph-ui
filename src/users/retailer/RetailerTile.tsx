import {Package} from "lucide-react";
import {type Retailer} from "./retailer.ts";
import {useNavigate} from "react-router-dom";

export const RetailerTile: React.FC<Retailer> = (retailer) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${retailer.id}/inventory`)}
      className="w-full text-left p-4 border border-[color:var(--color-border)] bg-panel-token hover:bg-[color:var(--color-muted)] hover:border-[color:var(--color-primary)] transition-all group rounded-none"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] truncate group-hover:text-[color:var(--color-primary)]">
            {retailer.name}
          </h3>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-0.5">
            {`${retailer.location?.city} ${retailer.location?.state}, `}
            {`${retailer.location?.address}, ${retailer.location?.zipCode}`}
          </p>
        </div>
        <div className="btn-minimal text-xs shrink-0">
          <Package/>
        </div>
      </div>
    </button>
  );
};