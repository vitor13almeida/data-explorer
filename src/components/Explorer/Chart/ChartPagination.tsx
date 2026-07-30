"use client";

import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import InputSelect from "@/components/Shared/Input/InputSelect";
import Button from "@/components/Shared/Button/Button";
import { useResourceContext } from "@/hooks/useResourceContext";
import { PAGE_SIZES } from "@/services/consts/explorer";
import { DropdownOptionProps } from "@ama-pt/agora-design-system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function extractValue(event: DropdownOptionProps[]): string {
  return event[0]?.value ?? "";
}

export default function ChartPagination() {
  const { t: te } = useTranslation("explorer");

  const { page, setPage, pageSize, setPageSize, totalFiltered } =
    useResourceContext();

  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;
  const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalFiltered);

  const handlePageSizeChange = (e: DropdownOptionProps[]) => {
    const value = Number(extractValue(e));
    if (PAGE_SIZES.includes(value)) {
      setPageSize(value);
      setPage(1);
    }
  };

  const pageSizeOptions = useMemo(
    () => (
      <DropdownSection label="section-page-size" name="section-page-size">
        {PAGE_SIZES.map((size) => (
          <DropdownOption
            key={size}
            value={String(size)}
            selected={size === pageSize}
          >
            {String(size)}
          </DropdownOption>
        ))}
      </DropdownSection>
    ),
    [pageSize],
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-16 rounded-lg border border-neutral-200 bg-white px-16 py-12">
      <div className="flex items-center gap-8">
        <span className="text-m-regular text-neutral-500 leading-none">
          {te("pagination.itemsPerPage")}
        </span>
        <div className="w-128">
          <InputSelect
            label=""
            placeholder=""
            multiple={false}
            hideSectionNames
            value={String(pageSize)}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions}
          </InputSelect>
        </div>
      </div>

      <span className="text-m-regular text-neutral-500">
        {te("pagination.range", {
          start: rangeStart,
          end: rangeEnd,
          total: totalFiltered,
        })}
      </span>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          appearance="outline"
          disabled={isFirstPage}
          onClick={() => setPage(page - 1)}
          aria-label={te("pagination.prev")}
          hasIcon
          iconOnly
          trailingIcon="agora-line-chevron-left"
          trailingIconHover="agora-line-chevron-left"
        />

        <span className="text-m-regular text-neutral-700 min-w-[80px] text-center">
          {te("pagination.pageOf", {
            current: page,
            total: totalPages,
          })}
        </span>

        <Button
          type="button"
          appearance="outline"
          disabled={isLastPage}
          onClick={() => setPage(page + 1)}
          aria-label={te("pagination.next")}
          hasIcon
          iconOnly
          trailingIcon="agora-line-chevron-right"
          trailingIconHover="agora-line-chevron-right"
        />
      </div>
    </div>
  );
}
