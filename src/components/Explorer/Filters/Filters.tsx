"use client";

import AccordionHeadless from "@/components/Shared/Accordion/AccordionHeadless";
import Button from "@/components/Shared/Button/Button";
import InputText from "@/components/Shared/Input/InputText";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

export default function Filters() {
  const { t: te } = useTranslation("explorer");

  const { showFilters, headers, filters, setFilters, applyFilters } =
    useResourceContext();

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

  return (
    <>
      <AccordionHeadless expanded={showFilters}>
        <div className="w-full grid grid-cols-12 gap-8 items-end">
          {headers.map((header, index) => {
            return (
              <div
                key={`filter-header-${index}`}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <InputText
                  label={header}
                  name={header}
                  value={filters[header]}
                  onChange={handleChangeFilter}
                />
              </div>
            );
          })}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
            <Button
              onClick={() => handleApplyFilters()}
              hasIcon
              trailingIcon="agora-line-search"
              trailingIconHover="agora-line-search"
            >
              {te("actions.filter")}
            </Button>
          </div>
        </div>
      </AccordionHeadless>
    </>
  );
}
