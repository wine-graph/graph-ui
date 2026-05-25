import type {ReactNode} from "react";

type TableShellProps = {
  children: ReactNode;
  className?: string;
};

export const TableShell = ({children, className = ""}: TableShellProps) => {
  return (
    <div className={`ui-table-shell ${className}`.trim()}>
      {children}
    </div>
  );
};
