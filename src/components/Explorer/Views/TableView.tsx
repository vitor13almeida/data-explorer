import { useEffect, useRef, useState } from "react";
import { Table } from "@/components/Shared/Table";
import { useResourceContext } from "@/hooks/useResourceContext";
import { INITIAL_PAGE, PAGE_SIZES } from "@/services/consts/explorer";
import { useTranslation } from "react-i18next";
import { SortOrder } from "@ama-pt/agora-design-system";

export default function TableView() {
  const { t: te } = useTranslation("explorer");

  const {
    isLoadingData,
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

  const sortNone: SortOrder[] = cols.map((h) =>
    h === sortColumn
      ? sortDirection === "asc"
        ? "ascending"
        : "descending"
      : "none",
  );

  const [currentSortDescription, setCurrentSortDescription] =
    useState<string>("");
  const [colSortOrders, setColSortOrders] = useState<SortOrder[]>(sortNone);

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

    const newSortOrders = sortNone as SortOrder[];
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

    const sortInitial: SortOrder[] = cols.map((h) =>
      h === sortColumn
        ? sortDirection === "asc"
          ? "ascending"
          : "descending"
        : "none",
    );

    setColSortOrders(sortInitial);
    initializedRef.current = true;
  }, [cols]);

  if (isLoadingData) {
    return (
      <div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto">
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
        <Table.Header>
          <Table.Row>
            {cols.map((col, index) => (
              <Table.HeaderCell
                key={col}
                onSortChange={(order: SortOrder) => handleSort(index, order)}
                sortOrder={colSortOrders[index]}
                sortType={"numeric"}
              >
                {col}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

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
      </Table.Root>
    </div>
  );
}
