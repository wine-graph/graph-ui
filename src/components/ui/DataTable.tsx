import type {ReactNode} from "react";
import {TableShell} from "./TableShell.tsx";

type DataColumn<T> = {
  id: string;
  header: ReactNode;
  render: (row: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  className?: string;
  tableClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
};

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  className = "",
  tableClassName = "",
  rowClassName = "border-b border-token/70 last:border-b-0",
}: DataTableProps<T>) => {
  return (
    <TableShell className={className}>
      <div className="overflow-x-auto">
        <table className={`w-full text-[14px] ${tableClassName}`.trim()}>
          <thead>
            <tr className="text-left">
              {columns.map((col) => (
                <th key={col.id} className={`py-2 px-2 border-b border-token ${col.headerClassName ?? ""}`.trim()}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey(row, index)} className={typeof rowClassName === "function" ? rowClassName(row, index) : rowClassName}>
                {columns.map((col) => (
                  <td key={col.id} className={`py-2 pr-4 ${col.cellClassName ?? ""}`.trim()}>
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
};

export default DataTable;
