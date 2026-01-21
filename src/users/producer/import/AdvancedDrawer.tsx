import React from "react";

type Props = {
  maxRows: number;
  onMaxRowsChange: (n: number) => void;
  dryRun: boolean;
  onDryRunChange: (b: boolean) => void;
  strictMode: boolean;
  onStrictModeChange: (b: boolean) => void;
};

// Collapsed by default; simple Details element to avoid extra lib deps
export const AdvancedDrawer: React.FC<Props> = ({ maxRows, onMaxRowsChange, dryRun, onDryRunChange, strictMode, onStrictModeChange }) => {
  return (
    <details className="mt-4 border border-token rounded-[var(--radius-md)]">
      <summary className="px-4 py-3 cursor-pointer text-[14px]">Advanced</summary>
      <div className="px-4 pb-4 pt-2 text-[14px] text-muted">Only change these if you know you need to.</div>
      <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3">
          <span className="w-40">Max rows</span>
          <input type="number" min={1} className="input input-sm w-28" value={maxRows} onChange={(e) => onMaxRowsChange(Number(e.target.value || 0))} />
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="checkbox" checked={dryRun} onChange={(e) => onDryRunChange(e.target.checked)} />
          <span>Dry run (extract only)</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="checkbox" checked={strictMode} onChange={(e) => onStrictModeChange(e.target.checked)} />
          <span>Strict mode (reject incomplete rows)</span>
        </label>
      </div>
    </details>
  );
};

export default AdvancedDrawer;
