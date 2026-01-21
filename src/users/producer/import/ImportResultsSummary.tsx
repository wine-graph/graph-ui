import React from "react";
import type {ImportResult} from "./types";

type Props = {
  result: ImportResult;
};

export const ImportResultsSummary: React.FC<Props> = ({ result }) => {
  return (
    <div className="border border-token rounded-[var(--radius-md)] p-4">
      <div className="flex flex-wrap gap-3 mb-3">
        <Chip label="Saved" value={result.saved} />
        <Chip label="Skipped" value={result.skipped} />
        <Chip label="Failed" value={result.failed} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-token">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Vintage</th>
              <th className="px-3 py-2 font-medium">Varietals</th>
            </tr>
          </thead>
          <tbody>
            {result.wines.map((w, i) => (
              <tr key={i} className="border-b border-token">
                <td className="px-3 py-2">{w.name}</td>
                <td className="px-3 py-2">{w.vintage ?? ""}</td>
                <td className="px-3 py-2">{(w.varietals ?? []).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Chip: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="inline-flex items-center gap-2 text-[13px] border border-token rounded-full px-3 py-1">
    <span className="text-muted">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ImportResultsSummary;
