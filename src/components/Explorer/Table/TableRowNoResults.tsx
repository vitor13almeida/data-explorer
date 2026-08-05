import { Table } from "@/components/Shared/Table";
import { useTranslation } from "react-i18next";

type TableRowNoResultsI = {
  colSpan: number;
};

export default function TableRowNoResults({ colSpan }: TableRowNoResultsI) {
  const { t: te } = useTranslation("explorer");

  return (
    <Table.Row>
      <Table.Cell headerLabel="" colSpan={colSpan}>
        <div
          className="sticky left-0 flex items-center justify-center py-64 text-m-regular text-neutral-500"
          style={{ width: "calc(100vw - 4rem)" }}
        >
          {te("views.table.noResults")}
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
