import React from "react";

type Props = {
  errors: { row: number; message: string }[];
};

export const ImportErrorsPanel: React.FC<Props> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <details className="border border-token rounded-[var(--radius-md)] p-3">
      <summary className="cursor-pointer text-[14px]">Errors ({errors.length})</summary>
      <ul className="mt-2 list-disc pl-5 text-[13px]">
        {errors.map((e, i) => (
          <li key={i} className="text-danger">Row {e.row}: {e.message}</li>
        ))}
      </ul>
    </details>
  );
};

export default ImportErrorsPanel;
