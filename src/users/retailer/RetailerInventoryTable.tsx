import React from "react";

type Wine = {
  vintage?: string | number;
  producer: string;
  name: string;
  varietal?: string;
  price?: number | string;
  quantity?: number;
};

type Props = {
  wines: Wine[];
  onRowClick?: (wine: Wine) => void;
};

// A dead-simple, reusable inventory table with responsive stacked rows on mobile
const RetailerInventoryTable: React.FC<Props> = ({ wines, onRowClick }) => {
  const showQty = wines.some((w) => typeof w.quantity === "number");

  const renderPrice = (p: Wine["price"]) => {
    if (p == null || p === "") return "—";
    if (typeof p === "number") return `$${p.toFixed(2)}`;
    return p;
  };

  // Desktop table (≥768px)
  const TableDesktop = (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-[color:var(--color-border)] border-t-0 border-l-0 border-r-0 rounded-none text-[14px]">
          <thead className="sticky top-0 z-10 bg-[color:var(--color-panel)] border-b-2 border-[color:var(--color-border)]">
            <tr>
              <th className="text-left py-3 px-4">Vintage</th>
              <th className="text-left py-3 px-4">Producer</th>
              <th className="text-left py-3 px-4">Wine Name</th>
              <th className="text-left py-3 px-4">Varietal</th>
              <th className="text-left py-3 px-4">Price</th>
              {showQty && <th className="text-left py-3 px-4">Qty</th>}
            </tr>
          </thead>
          <tbody>
            {wines.map((w, idx) => {
              const key = `${w.producer}-${w.name}-${String(w.vintage ?? "NV")}-${idx}`;
              return (
                <tr
                  key={key}
                  className="even:bg-[color:var(--color-muted)]/10 hover:bg-[color:var(--color-muted)]/20 cursor-pointer"
                  onClick={() => onRowClick?.(w)}
                >
                  <td className="py-3 px-4">{w.vintage ?? "—"}</td>
                  <td className="py-3 px-4">{w.producer}</td>
                  <td className="py-3 px-4"><span className="text-[15px] font-semibold">{w.name}</span></td>
                  <td className="py-3 px-4">{w.varietal ?? "—"}</td>
                  <td className="py-3 px-4">{renderPrice(w.price)}</td>
                  {showQty && <td className="py-3 px-4">{typeof w.quantity === "number" ? w.quantity : "—"}</td>}
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
          const key = `${w.producer}-${w.name}-${String(w.vintage ?? "NV")}-${idx}`;
          return (
            <li
              key={key}
              className="py-3 px-4 even:bg-[color:var(--color-muted)]/10 hover:bg-[color:var(--color-muted)]/20 cursor-pointer"
              onClick={() => onRowClick?.(w)}
            >
              <div className="font-semibold">
                {w.vintage ? `[${w.vintage}] ` : ""}{w.producer} – {w.name}
              </div>
              <div className="text-[14px] text-[color:var(--color-fg-muted)]">
                {w.varietal ?? "—"}
                <span className="mx-2">•</span>
                {renderPrice(w.price)}
                {showQty && (
                  <>
                    <span className="mx-2">•</span>
                    {typeof w.quantity === "number" ? w.quantity : "—"}
                  </>
                )}
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
