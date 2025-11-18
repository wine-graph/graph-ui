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
        w-full text-left p-4 border border-[color:var(--color-border)] 
        bg-panel-token hover:bg-[color:var(--color-muted)] 
        hover:border-[color:var(--color-primary)] 
        transition-all group rounded-none
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Title + optional desc */}
        <div className="min-w-0 flex-1 text-left">
          <h3
            className="font-semibold text-[15px] truncate group-hover:text-[color:var(--color-primary)] transition-colors">
            {title}
          </h3>
          {desc && (
            <p className="text-xs text-[color:var(--color-fg-muted)] mt-1 line-clamp-2">
              {desc}
            </p>
          )}
        </div>

        {/* Right: Icon + action text */}
        <div className="btn-minimal text-xs shrink-0">
          <ChevronRight/>
        </div>
      </div>
    </button>
  );
};