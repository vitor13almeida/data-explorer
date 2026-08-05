import { Table } from "@/components/Shared/Table";
import { SortOrder } from "@ama-pt/agora-design-system";

type TableHeaderI = {
  cols: string[];
  colSortOrders: SortOrder[];
  onSort: (colIdx: number, order: SortOrder) => void;
};

export default function TableHeader({
  cols,
  colSortOrders,
  onSort,
}: TableHeaderI) {
  return (
    <Table.Header>
      <Table.Row>
        {cols.map((col, index) => (
          <Table.HeaderCell
            key={col}
            onSortChange={(order: SortOrder) => onSort(index, order)}
            sortOrder={colSortOrders[index]}
            sortType="numeric"
          >
            {col}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
  );
}
