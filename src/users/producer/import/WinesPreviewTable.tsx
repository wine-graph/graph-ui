import React from "react";
import type {Wine} from "./types";

type Props = {
  wines: Wine[];
  onEdit: (index: number, patch: Partial<Wine>) => void;
  invalids?: { index: number; message: string }[];
};

export const WinesPreviewTable: React.FC<Props> = ({ wines, onEdit, invalids = [] }) => {
  const invalidByIndex = new Map<number, string[]>();
  invalids.forEach(({ index, message }) => {
    const arr = invalidByIndex.get(index) ?? [];
    arr.push(message);
    invalidByIndex.set(index, arr);
  });

  return (
    <div className="border border-token rounded-[var(--radius-md)] overflow-x-auto">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-[color:var(--color-surface-soft,transparent)] border-b border-token">
          <tr>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Vintage</th>
            <th className="px-3 py-2 font-medium">Varietals</th>
            <th className="px-3 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {wines.map((w, i) => {
            const errors = invalidByIndex.get(i) ?? [];
            const errMsg = errors.join(" • ");
            console.log(errMsg);
            return (
              <tr key={i} className="border-b border-token align-top">
                <td className="px-3 py-2">
                  <input
                    value={w.name ?? ""}
                    onChange={(e) => onEdit(i, { name: e.target.value })}
                    className={`input input-sm w-full ${errors.some(m => m.toLowerCase().includes("name")) ? "input-error" : ""}`}
                    aria-invalid={errors.some(m => m.toLowerCase().includes("name"))}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={w.vintage ?? ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="YYYY"
                    onChange={(e) => onEdit(i, { vintage: e.target.value ? Number(e.target.value) : null })}
                    className={`input input-sm w-28 ${errors.some(m => m.toLowerCase().includes("vintage")) ? "input-error" : ""}`}
                    aria-invalid={errors.some(m => m.toLowerCase().includes("vintage"))}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={(w.varietals ?? []).join(", ")}
                    onChange={(e) => onEdit(i, { varietals: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    className="input input-sm w-full"
                    placeholder="Cabernet Sauvignon, Merlot"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={w.description ?? ""}
                    onChange={(e) => onEdit(i, { description: e.target.value })}
                    className="input input-sm w-full"
                    placeholder="Optional"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {invalids.length > 0 ? (
        <div className="p-2 text-[12px] text-muted border-t border-token" role="status" aria-live="polite">
          {invalids.length} row(s) need attention.
        </div>
      ) : null}
    </div>
  );
};

export default WinesPreviewTable;
