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
      <div className="ui-data-table-scroll">
        <table className={`ui-data-table ${tableClassName}`.trim()}>
          <thead>
            <tr className="text-left">
              {columns.map((col) => (
                <th key={col.id} className={`ui-data-table-head-cell ${col.headerClassName ?? ""}`.trim()}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey(row, index)} className={typeof rowClassName === "function" ? rowClassName(row, index) : rowClassName}>
                {columns.map((col) => (
                  <td key={col.id} className={`ui-data-table-cell ${col.cellClassName ?? ""}`.trim()}>
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
