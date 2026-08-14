import { useEffect, useRef, useState } from "react";
import { Table } from "@/components/Shared/Table";
import { useResourceContext } from "@/hooks/useResourceContext";
import { INITIAL_PAGE, PAGE_SIZES } from "@/services/consts/explorer";
import { useTranslation } from "react-i18next";
import { SortOrder } from "@ama-pt/agora-design-system";
import TableHeader from "../Table/TableHeader";
import TableBody from "../Table/TableBody";

export default function TableView() {
  const { t: te } = useTranslation("explorer");

  const {
    data,
    appliedHeadersVisibility,
    totalFiltered,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useResourceContext();

  const cols = Object.keys(appliedHeadersVisibility).filter(
    (h) => appliedHeadersVisibility[h] === true,
  );

  const buildSortOrders = (): SortOrder[] =>
    cols.map((h) =>
      h === sortColumn
        ? sortDirection === "asc"
          ? "ascending"
          : "descending"
        : "none",
    );

  const [currentSortDescription, setCurrentSortDescription] = useState("");
  const [colSortOrders, setColSortOrders] =
    useState<SortOrder[]>(buildSortOrders());

  const rows = data?.data ?? [];

  const handleChangePageSize = (newSize: number) => {
    if (PAGE_SIZES.includes(newSize)) {
      setPageSize(newSize);
      setPage(INITIAL_PAGE);
    }
  };

  const handleChangePage = (tablePage: number) => {
    setPage(tablePage + 1);
  };

  const handleSort = (colIdx: number, order: SortOrder) => {
    setCurrentSortDescription(
      `Applying sort order ${order} via column ${cols[colIdx]}`,
    );

    const newSortOrders = buildSortOrders();
    newSortOrders[colIdx] = order;
    setColSortOrders(newSortOrders);

    if (order === "none") {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortColumn(cols[colIdx]);
      setSortDirection(order.startsWith("asc") ? "asc" : "desc");
    }
  };

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || cols.length === 0) return;

    setColSortOrders(buildSortOrders());
    initializedRef.current = true;
  }, [cols]);

  return (
    <div className="max-h-[800px] overflow-y-auto">
      <Table.Root
        sortDescription={currentSortDescription}
        paginationProps={{
          itemsPerPageLabel: te("views.table.itemsPerPageLabel"),
          itemsPerPage: pageSize,
          totalItems: totalFiltered,
          currentPage: page - 1,
          availablePageSizes: PAGE_SIZES,
          buttonDropdownAriaLabel: te("views.table.buttonDropdownAriaLabel"),
          dropdownListAriaLabel: te("views.table.dropdownListAriaLabel"),
          prevButtonAriaLabel: te("views.table.prevButtonAriaLabel"),
          nextButtonAriaLabel: te("views.table.nextButtonAriaLabel"),
          onPageChange: handleChangePage,
          onPageSizeChange: handleChangePageSize,
        }}
      >
        <TableHeader
          cols={cols}
          colSortOrders={colSortOrders}
          onSort={handleSort}
        />

        <TableBody cols={cols} rows={rows} />
      </Table.Root>
    </div>
  );
}
