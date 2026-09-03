"use client";

import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import Dropdown from "@/components/Shared/Dropdown/Dropdown";
import Button from "@/components/Shared/Button/Button";
import { useResourceContext } from "@/hooks/useResourceContext";
import { INITIAL_PAGE, PAGE_SIZES } from "@/services/consts/explorer";
import {
  DropdownElement,
  DropdownOptionProps,
} from "@ama-pt/agora-design-system";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function extractValue(event: DropdownOptionProps[]): string {
  return event[0]?.value ?? "";
}

export default function ChartPagination() {
  const { t: te } = useTranslation("explorer");

  const { page, setPage, pageSize, setPageSize, totalFiltered } =
    useResourceContext();

  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const isFirstPage = page <= INITIAL_PAGE;
  const isLastPage = page >= totalPages;

  const dropdownId = useId();
  const itemsSectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<DropdownElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current?.visibility &&
        !itemsSectionRef.current?.contains(event.target as Node)
      ) {
        dropdownRef.current.hide();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (dropdownRef.current?.visibility) {
      dropdownRef.current.hide();
    } else {
      dropdownRef.current?.show();
    }
  };

  const handlePageSizeChange = (e: DropdownOptionProps[]) => {
    const value = Number(extractValue(e));
    if (PAGE_SIZES.includes(value)) {
      setPageSize(value);
      setPage(INITIAL_PAGE);
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
    <div className="flex justify-between rounded-lg border border-neutral-200 bg-white">
      <div
        ref={itemsSectionRef}
        className="relative flex items-center border-r border-neutral-200"
      >
        <Button
          appearance="link"
          variant="primary"
          hasIcon
          trailingIcon={
            isOpen ? "agora-solid-chevron-up" : "agora-solid-chevron-down"
          }
          trailingIconHover={
            isOpen ? "agora-line-chevron-up" : "agora-line-chevron-down"
          }
          role="combobox"
          aria-controls={dropdownId}
          aria-expanded={isOpen}
          aria-label={te("pagination.itemsPerPageDropdownAriaLabel")}
          onClick={toggleDropdown}
        >
          <span className="text-neutral-700">
            {te("pagination.itemsPerPage")}: {pageSize}
          </span>
        </Button>

        <div className="absolute -bottom-8 left-0 w-full min-h-[8px]">
          <Dropdown
            id={dropdownId}
            ref={dropdownRef}
            type="text"
            hideSectionNames
            aria-label={te("pagination.itemsPerPageListAriaLabel")}
            onShow={() => setIsOpen(true)}
            onHide={() => setIsOpen(false)}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions}
          </Dropdown>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          appearance="link"
          hasIcon
          iconOnly
          trailingIcon="agora-line-chevron-left"
          trailingIconHover="agora-line-chevron-left"
          disabled={isFirstPage}
          onClick={() => setPage(page - 1)}
          aria-label={te("pagination.prev")}
        />
        <div className="w-[1px] h-full bg-neutral-200" />
        <Button
          appearance="link"
          hasIcon
          iconOnly
          trailingIcon="agora-line-chevron-right"
          trailingIconHover="agora-line-chevron-right"
          disabled={isLastPage}
          onClick={() => setPage(page + 1)}
          aria-label={te("pagination.next")}
        />
      </div>
    </div>
  );
}
