import { useEffect, useState } from "react";
import { Table } from "@/components/Shared/Table";
import { useResourceContext } from "@/hooks/useResourceContext";
import { PAGE_SIZES } from "@/services/consts/explorer";
import { useTranslation } from "react-i18next";

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

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);

  const headers = structure?.profile.header ?? [];
  const totalItems = data?.meta.total ?? 1;
  const rows = data?.data ?? [];
  const totalRows = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    if (!resourceId) return;

    void loadData(page, pageSize);
  }, [resourceId, page, pageSize, loadData]);

  if (isLoadingData || isLoadingStructure) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleChangePageSize = (newSize: number) => {
    if (PAGE_SIZES.includes(newSize)) {
      setPageSize(newSize);
      setPage(0);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <Table.Root
        paginationProps={{
          itemsPerPageLabel: te("tabs.table.itemsPerPageLabel"),
          itemsPerPage: pageSize,
          totalItems: totalRows,
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
            {headers.map((header) => (
              <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
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
