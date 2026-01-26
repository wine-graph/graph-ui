import React from "react";
import { Link } from "react-router-dom";
import logo64 from "../../public/wine_graph_logo_64x64.png";
import logo128 from "../../public/wine_graph_logo_128x128.png";
import logo256 from "../../public/wine_graph_logo_256x256.png";

type Wine = {
  vintage: string | number;
  name: string;
  varietal: string;
  slug?: string;
  canonicalId?: string;
};

type Props = {
  wines: Wine[];
  onRowClick?: (wine: Wine) => void;
  // Called when a row/card receives focus so caller can restore focus after closing drawer
  onRowFocus?: (el: HTMLElement, wine: Wine) => void;
};

// Responsive inventory table. Desktop uses a table; mobile uses stacked list rows.
const RetailerInventoryTable: React.FC<Props> = ({ wines, onRowClick, onRowFocus }) => {
  // Desktop table (≥768px)
  const TableDesktop = (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-[color:var(--color-border)] border-t-0 border-l-0 border-r-0 rounded-none text-[14px]">
          <thead className="sticky top-0 z-10 bg-[color:var(--color-panel)] border-b-2 border-[color:var(--color-border)]">
            <tr>
              {/* Tighter, left-aligned status column */}
              <th className="text-left py-3 pl-3 pr-2 w-14">Matched</th>
              <th className="text-left py-3 px-4">Wine Name</th>
              <th className="text-left py-3 px-4">Vintage</th>
              <th className="text-left py-3 px-4">Varietal</th>
            </tr>
          </thead>
          <tbody>
            {wines.map((w, idx) => {
              const key = `${w.canonicalId ?? "noid"}-${w.name}-${String(w.vintage ?? "NV")}-${idx}`;
              const wineHref = w.canonicalId ? `/wine/${w.slug}/${w.canonicalId}` : undefined;
              return (
                <tr
                  key={key}
                  className="even:bg-[color:var(--color-muted)]/10 hover:bg-[color:var(--color-muted)]/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black hover:shadow-[inset_3px_0_0_0_var(--color-fg)] focus-visible:shadow-[inset_3px_0_0_0_var(--color-fg)] transition-colors"
                  tabIndex={0}
                  role="button"
                  onClick={() => onRowClick?.(w)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick?.(w);
                    }
                  }}
                  onFocus={(e) => onRowFocus?.(e.currentTarget as HTMLElement, w)}
                >
                  {/* Matched status cell */}
                  <td className="py-3 pl-3 pr-2 text-left align-middle">
                    {w.canonicalId ? (
                      <img
                        src={logo64}
                        srcSet={`${logo128} 2x, ${logo256} 4x`}
                        width={28}
                        height={28}
                        alt="Matched wine (in Wine Graph)"
                        title="Matched wine"
                        className="inline-block w-7 h-7 opacity-80 grayscale"
                      />
                    ) : null}
                  </td>
                  <td className="py-3 px-4">
                    {wineHref ? (
                      <Link
                        to={wineHref}
                        className="text-[15px] font-semibold underline-offset-2 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {w.name}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold">{w.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{w.vintage ?? "—"}</td>
                  <td className="py-3 px-4">{w.varietal ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mobile stacked (<768px)
  const ListMobile = (
    <div className="md:hidden border-t-2 border-[color:var(--color-border)] text-[14px]">
      <ul className="divide-y-2 divide-[color:var(--color-border)]">
        {wines.map((w, idx) => {
          const key = `${w.canonicalId ?? "noid"}-${w.name}-${String(w.vintage ?? "NV")}-${idx}`;
          const wineHref = w.canonicalId ? `/wine/${w.slug}/${w.canonicalId}` : undefined;
          return (
            <li
              key={key}
              className="py-3 px-4 even:bg-[color:var(--color-muted)]/10 hover:bg-[color:var(--color-muted)]/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black hover:shadow-[inset_3px_0_0_0_var(--color-fg)] focus-visible:shadow-[inset_3px_0_0_0_var(--color-fg)] transition-colors"
              tabIndex={0}
              role="button"
              onClick={() => onRowClick?.(w)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick?.(w);
                }
              }}
              onFocus={(e) => onRowFocus?.(e.currentTarget as HTMLElement, w)}
            >
              <div className="font-semibold">
                {w.vintage ? `[${w.vintage}] ` : ""}
                {wineHref ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Link
                      to={wineHref}
                      className="underline-offset-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {w.name}
                    </Link>
                    <img
                      src={logo64}
                      srcSet={`${logo128} 2x, ${logo256} 4x`}
                      width={24}
                      height={24}
                      alt="Matched wine"
                      title="Matched wine"
                      className="inline-block w-6 h-6 opacity-80 grayscale"
                      aria-hidden={false}
                    />
                  </span>
                ) : (
                  <>
                    {w.name}
                  </>
                )}
              </div>
              <div className="text-[14px] text-[color:var(--color-fg-muted)]">
                {w.varietal ?? "—"}
                <span className="mx-2">•</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="border-2 border-[color:var(--color-border)] rounded-none bg-[color:var(--color-panel)]">
      {TableDesktop}
      {ListMobile}
    </div>
  );
};

export default RetailerInventoryTable;
