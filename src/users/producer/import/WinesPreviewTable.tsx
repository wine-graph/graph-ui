import React, {useCallback, useRef} from "react";
import type {Wine} from "./types";
import {InputField, TableShell} from "../../../components/ui";

type Props = {
  wines: Wine[];
  onEdit: (index: number, patch: Partial<Wine>) => void;
  invalids?: { index: number; message: string }[];
};

export const WinesPreviewTable: React.FC<Props> = ({ wines, onEdit, invalids = [] }) => {
  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const invalidByIndex = new Map<number, string[]>();
  invalids.forEach(({ index, message }) => {
    const arr = invalidByIndex.get(index) ?? [];
    arr.push(message);
    invalidByIndex.set(index, arr);
  });

  const setCellRef = useCallback((row: number, col: number, el: HTMLInputElement | null) => {
    cellRefs.current[`${row}:${col}`] = el;
  }, []);

  const focusCell = useCallback((row: number, col: number) => {
    const next = cellRefs.current[`${row}:${col}`];
    if (!next) return;
    next.focus();
    next.select();
  }, []);

  const onCellKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const key = e.key;

    if (key === "ArrowUp") {
      e.preventDefault();
      if (row > 0) focusCell(row - 1, col);
      return;
    }

    if (key === "ArrowDown") {
      e.preventDefault();
      if (row < wines.length - 1) focusCell(row + 1, col);
      return;
    }

    if (key === "ArrowLeft") {
      const input = e.currentTarget;
      const caret = input.selectionStart ?? 0;
      if (caret === 0 && col > 0) {
        e.preventDefault();
        focusCell(row, col - 1);
      }
      return;
    }

    if (key === "ArrowRight") {
      const input = e.currentTarget;
      const caret = input.selectionStart ?? 0;
      const valueLength = input.value.length;
      if (caret === valueLength && col < 3) {
        e.preventDefault();
        focusCell(row, col + 1);
      }
      return;
    }

    if (key !== "Enter") return;
    e.preventDefault();

    if (e.shiftKey) {
      if (col > 0) {
        focusCell(row, col - 1);
        return;
      }
      if (row > 0) {
        focusCell(row - 1, 3);
      }
      return;
    }

    if (col < 3) {
      focusCell(row, col + 1);
      return;
    }
    if (row < wines.length - 1) {
      focusCell(row + 1, 0);
    }
  }, [focusCell, wines.length]);

  return (
    <TableShell className="rounded-[var(--radius-md)] overflow-x-auto">
      <table className="w-full text-left text-[14px]" aria-label="Imported wines preview">
        <thead className="sticky top-0 z-10 bg-[color:var(--color-surface-soft,transparent)] border-b border-token">
          <tr>
            <th className="px-3 py-2 font-medium w-14">Row</th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Vintage</th>
            <th className="px-3 py-2 font-medium">Varietals</th>
            <th className="px-3 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {wines.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-muted" colSpan={5}>No rows found in this file.</td>
            </tr>
          ) : null}
          {wines.map((w, i) => {
            const errors = invalidByIndex.get(i) ?? [];
            const rowHasError = errors.length > 0;
            return (
              <tr key={i} className={`border-b border-token align-top ${rowHasError ? "bg-[color:var(--color-danger)]/10" : "even:bg-[color:var(--color-muted)]/15"}`}>
                <td className="px-3 py-2 text-muted">{i + 1}</td>
                <td className="px-3 py-2">
                  <InputField
                    ref={(el) => setCellRef(i, 0, el)}
                    value={w.name ?? ""}
                    onChange={(e) => onEdit(i, { name: e.target.value })}
                    onKeyDown={(e) => onCellKeyDown(e, i, 0)}
                    className={errors.some(m => m.toLowerCase().includes("name")) ? "border-[color:var(--color-danger)]" : ""}
                    aria-invalid={errors.some(m => m.toLowerCase().includes("name"))}
                  />
                </td>
                <td className="px-3 py-2">
                  <InputField
                    ref={(el) => setCellRef(i, 1, el)}
                    value={w.vintage ?? ""}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="YYYY"
                    onChange={(e) => onEdit(i, { vintage: e.target.value ? Number(e.target.value) : null })}
                    onKeyDown={(e) => onCellKeyDown(e, i, 1)}
                    className={`w-28 ${errors.some(m => m.toLowerCase().includes("vintage")) ? "border-[color:var(--color-danger)]" : ""}`}
                    aria-invalid={errors.some(m => m.toLowerCase().includes("vintage"))}
                  />
                </td>
                <td className="px-3 py-2">
                  <InputField
                    ref={(el) => setCellRef(i, 2, el)}
                    value={(w.varietals ?? []).join(", ")}
                    onChange={(e) => onEdit(i, { varietals: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    onKeyDown={(e) => onCellKeyDown(e, i, 2)}
                    placeholder="Cabernet Sauvignon, Merlot"
                  />
                </td>
                <td className="px-3 py-2">
                  <InputField
                    ref={(el) => setCellRef(i, 3, el)}
                    value={w.description ?? ""}
                    onChange={(e) => onEdit(i, { description: e.target.value })}
                    onKeyDown={(e) => onCellKeyDown(e, i, 3)}
                    placeholder="Optional"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {invalids.length > 0 ? (
        <div className="p-2 text-[12px] text-muted border-t border-token flex items-center justify-between gap-2" role="status" aria-live="polite">
          <span>{invalids.length} validation issue(s) found.</span>
          <span className="text-[color:var(--color-danger)]">Fix highlighted rows before confirming.</span>
        </div>
      ) : null}
    </TableShell>
  );
};

export default WinesPreviewTable;
