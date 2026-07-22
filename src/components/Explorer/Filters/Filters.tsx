"use client";

import AccordionHeadless from "@/components/Shared/Accordion/AccordionHeadless";
import Button from "@/components/Shared/Button/Button";
import InputText from "@/components/Shared/Input/InputText";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import FilterOperator from "./FilterOperator";

export default function Filters() {
  const { t: te } = useTranslation("explorer");

  const {
    showFilters,
    headers,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    structure,
  } = useResourceContext();

  const handleChangeFilter = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <>
      <AccordionHeadless expanded={showFilters}>
        <div className="w-full grid grid-cols-12 gap-16 items-end">
          {headers.map((header, index) => {
            return (
              <div
                key={`filter-header-${index}`}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-row gap-2"
              >
                <div className="grow">
                  <InputText
                    label={header}
                    name={header}
                    value={filters[header] ?? ""}
                    onChange={handleChangeFilter}
                  />
                </div>
                {structure && (
                  <div className="shrink self-end">
                    <FilterOperator
                      dataType={
                        structure.profile.columns[header].format === "string"
                          ? "text"
                          : "numeric"
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-row gap-8">
            <Button
              onClick={() => handleApplyFilters()}
              hasIcon
              trailingIcon="agora-line-search"
              trailingIconHover="agora-line-search"
              fullWidth={true}
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
      </AccordionHeadless>
    </>
  );
}
