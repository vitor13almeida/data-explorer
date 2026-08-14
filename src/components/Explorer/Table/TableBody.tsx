import { Table } from "@/components/Shared/Table";
import { DataRow } from "@/services/types";
import TableRowNoResults from "./TableRowNoResults";

type TableBodyI = {
  cols: string[];
  rows: DataRow[];
};

export default function TableBody({ cols, rows }: TableBodyI) {
  if (rows.length === 0) {
    return (
      <Table.Body>
        <TableRowNoResults colSpan={cols.length} />
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {rows.map((line, lineIndex) => (
        <Table.Row key={`line-${lineIndex}`}>
          {cols.map((col, colIndex) => (
            <Table.Cell
              key={`line-${lineIndex}-col-${colIndex}`}
              headerLabel={col}
            >
              {String(line[col] ?? "")}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
}
