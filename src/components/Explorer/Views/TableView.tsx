import { useEffect, useRef, useState } from "react";
import { Table } from "@/components/Shared/Table";
import { useResourceContext } from "@/hooks/useResourceContext";
import { PAGE_SIZES } from "@/services/consts/explorer";
import { useTranslation } from "react-i18next";
import { SortOrder } from "@ama-pt/agora-design-system";

type SortCol = {
  column: string | null;
  order: "asc" | "desc" | null;
};

export default function TableView() {
  const { t: te } = useTranslation("explorer");

  const {
    isLoadingData,
    isLoadingStructure,
    data,
    headers,
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

  const sortNone: SortOrder[] = headers.map((h) =>
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
      setPage(0);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (colIdx: number, order: SortOrder) => {
    setCurrentSortDescription(
      `Applying sort order ${order} via column ${headers[colIdx]}`,
    );

    const newSortOrders = sortNone as SortOrder[];
    newSortOrders[colIdx] = order;

    setColSortOrders(newSortOrders);

    if (order === "none") {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortColumn(headers[colIdx]);
      setSortDirection(order.startsWith("asc") ? "asc" : "desc");
    }
  };

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || headers.length === 0) return;

    const sortInitial: SortOrder[] = headers.map((h) =>
      h === sortColumn
        ? sortDirection === "asc"
          ? "ascending"
          : "descending"
        : "none",
    );

    setColSortOrders(sortInitial);
    initializedRef.current = true;
  }, [headers]);

  if (isLoadingData || isLoadingStructure) {
    return (
      <div>
        <p>Loading...</p>
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
          currentPage: page,
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
            {headers.map((header, index) => (
              <Table.HeaderCell
                key={header}
                onSortChange={(order: SortOrder) => handleSort(index, order)}
                sortOrder={colSortOrders[index]}
                sortType={"numeric"}
              >
                {header}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((line, lineIndex) => {
            const values = Object.entries(line).filter(
              ([key]) => key !== "__id",
            );

            return (
              <Table.Row key={`line-${lineIndex}`}>
                {values.map(([key, value], keyIndex) => (
                  <Table.Cell
                    key={`line-${lineIndex}-key-${keyIndex}`}
                    headerLabel={key}
                  >
                    {String(value ?? "")}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
