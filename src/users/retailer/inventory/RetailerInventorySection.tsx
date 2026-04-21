import type {RetailerInventory} from "../retailer.ts";
import {useMemo, useState} from "react";
import RetailerInventoryTable from "./RetailerInventoryTable.tsx";
import {ActionRow, Card, EmptyState, InputField, SectionTitle} from "../../../components/ui";

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
    <Card className="p-6">
      {/* Screen header: title + actions */}
      <ActionRow className="sm:items-end mb-4">
        <div>
          <SectionTitle eyebrow="Cellar" title="Inventory" titleClassName="text-[28px]" />
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-0.5">{inventory.length} wines available</p>
        </div>
      </ActionRow>

      {/* Controls row: search above table */}
      <div className="mb-4">
        <InputField
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search inventory…"
          aria-label="Search inventory"
        />
      </div>

      {filteredInventory?.length === 0 ? (
        <EmptyState
          title={inventory?.length === 0 ? "No wines in inventory yet." : "No inventory matches your search."}
          action={
            inventory?.length === 0
              ? undefined
              : <button className="underline text-[13px]" onClick={() => setQuery("")}>Clear search</button>
          }
          className="py-16"
        />
      ) : (
        <RetailerInventoryTable
          wines={filteredInventory}
        />
      )}
    </Card>
  );
};
