import React from "react";

type Props = {
  errors: { row: number; message: string }[];
};

export const ImportErrorsPanel: React.FC<Props> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <details className="border border-token rounded-[var(--radius-md)] p-3">
      <summary className="cursor-pointer text-[14px]">
        {errors.length} row{errors.length === 1 ? "" : "s"} could not be imported
      </summary>
      <p className="mt-2 text-[12px] text-muted">Review and fix these rows in your CSV, then re-import.</p>
      <ul className="mt-2 list-disc pl-5 text-[13px]">
        {errors.map((e, i) => (
          <li key={i} className="text-danger">Row {e.row}: {e.message}</li>
        ))}
      </ul>
    </details>
  );
};

export default ImportErrorsPanel;
