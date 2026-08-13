"use client";

import Button from "@/components/Shared/Button/Button";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";

export default function Filters() {
  const { t: te } = useTranslation("explorer");

  const {
    headers,
    nHeadersVisible,
    applyFilters,
    clearFilters,
    invalidFilters,
  } = useResourceContext();

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <>
      <div className="w-full grid grid-cols-12 gap-32 items-end">
        {headers.map((header, index) => {
          return (
            <div
              key={`filter-header-${index}`}
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
            >
              <Filter header={header} />
            </div>
          );
        })}
        <div className="col-span-12 flex flex-row gap-32">
          <Button
            onClick={() => handleApplyFilters()}
            hasIcon
            trailingIcon="agora-line-search"
            trailingIconHover="agora-line-search"
            fullWidth={true}
            disabled={invalidFilters || nHeadersVisible < 1}
          >
            {te("actions.filter")}
          </Button>
          <Button
            onClick={() => handleClearFilters()}
            hasIcon
            trailingIcon="agora-line-delete"
            trailingIconHover="agora-line-delete"
            fullWidth={true}
            variant="danger"
          >
            {te("actions.clear")}
          </Button>
        </div>
      </div>
    </>
  );
}
