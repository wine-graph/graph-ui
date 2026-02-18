import type {RetailerInventory} from "../retailer.ts";
import {useMemo, useState} from "react";
import RetailerInventoryTable from "./RetailerInventoryTable.tsx";

type RetailerInventorySectionProps = {
  inventory: RetailerInventory[];
};

export const RetailerInventorySection = ({inventory}: RetailerInventorySectionProps) => {
  // Local UI state for Inventory search
  const [query, setQuery] = useState("");

  const filteredInventory = useMemo(() => {
    if (!query.trim()) return inventory;
    const q = query.toLowerCase();
    return inventory?.filter((w: RetailerInventory) => {
      const vintage = w.vintage ? String(w.vintage) : "";
      return (
        (w.name?.toLowerCase?.() ?? "").includes(q) ||
        (w.varietal?.toLowerCase?.() ?? "").includes(q) ||
        vintage.toLowerCase().includes(q)
      );
    });
  }, [inventory, query]);

  return (
    <div>
      {/* Screen header: title + actions */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-0.5">{inventory.length} wines available</p>
        </div>
      </div>

      {/* Controls row: search above table */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search inventory…"
          className="w-full h-10 px-3 border-2 border-[color:var(--color-border)] bg-[color:var(--color-panel)] placeholder-[color:var(--color-fg-muted)]"
          aria-label="Search inventory"
        />
      </div>

      {filteredInventory?.length === 0 ? (
        <div
          className="text-center py-16 text-[color:var(--color-fg-muted)] border-2 border-dashed border-[color:var(--color-border)]">
          {inventory?.length === 0 ? (
            <div>No wines in inventory yet.</div>
          ) : (
            <>
              <div>No inventory matches your search.</div>
              <button className="mt-3 underline" onClick={() => setQuery("")}>Clear search</button>
            </>
          )}
        </div>
      ) : (
        <RetailerInventoryTable
          wines={filteredInventory}
        />
      )}
    </div>
  );
};