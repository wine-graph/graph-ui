import type {ReactNode} from "react";

type TableShellProps = {
  children: ReactNode;
  className?: string;
};

export const TableShell = ({children, className = ""}: TableShellProps) => {
  return (
    <div className={`border border-token rounded-[var(--radius-sm)] bg-[color:var(--color-panel)] ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TableShell;
