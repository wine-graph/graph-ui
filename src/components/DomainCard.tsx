import React from "react";
import {ChevronRight} from "lucide-react";

export const DomainCard: React.FC<{
  title: string;
  desc?: string;
  onClick: () => void;
  className?: string;
}> = ({title, desc, onClick, className = ""}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-5 border border-[color:var(--color-border)]
        bg-panel-token hover:bg-[color:var(--color-muted)]
        transition-all duration-200 group rounded-[var(--radius-md)]
        hover:-translate-y-[1px] hover:shadow-[var(--shadow-soft)]
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Title + optional desc */}
        <div className="min-w-0 flex-1 text-left">
          <h3 className="font-semibold text-[16px] truncate group-hover:text-[color:var(--color-accent)] transition-colors">
            {title}
          </h3>
          {desc && (
            <p className="text-xs text-[color:var(--color-fg-muted)] mt-1.5 line-clamp-2">
              {desc}
            </p>
          )}
        </div>

        {/* Right: Icon + action text */}
        <div className="btn-minimal text-xs shrink-0 group-hover:text-[color:var(--color-accent)]">
          <ChevronRight/>
        </div>
      </div>
    </button>
  );
};
