import { useEffect, useState } from "react";
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
    resourceId,
    isLoadingData,
    isLoadingStructure,
    data,
    structure,
    loadData,
  } = useResourceContext();

  const headers = structure?.profile.header ?? [];
  const sortNone: SortOrder[] = headers.map(() => "none");

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);

  const [currentSortDescription, setCurrentSortDescription] =
    useState<string>("");
  const [colSortOrders, setColSortOrders] = useState<SortOrder[]>(sortNone);
  const [sort, setSort] = useState<SortCol>({ column: null, order: null });

  const totalItems = data?.meta.total ?? 1;
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
      setSort({ column: null, order: null });
    } else {
      setSort({
        column: headers[colIdx],
        order: order.startsWith("asc") ? "asc" : "desc",
      });
    }
  };

  useEffect(() => {
    if (!resourceId) return;

    void loadData(page, pageSize, sort.column, sort.order);
  }, [resourceId, page, pageSize, loadData, sort]);

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
          itemsPerPageLabel: te("tabs.table.itemsPerPageLabel"),
          itemsPerPage: pageSize,
          totalItems: totalItems,
          currentPage: page,
          availablePageSizes: PAGE_SIZES,
          buttonDropdownAriaLabel: te("tabs.table.buttonDropdownAriaLabel"),
          dropdownListAriaLabel: te("tabs.table.dropdownListAriaLabel"),
          prevButtonAriaLabel: te("tabs.table.prevButtonAriaLabel"),
          nextButtonAriaLabel: te("tabs.table.nextButtonAriaLabel"),
          onPageChange: handleChangePage,
          onPageSizeChange: handleChangePageSize,
        }}
      >
        {/* header */}
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

        {/* body */}
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
