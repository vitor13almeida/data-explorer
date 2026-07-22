"use client";

import InputText from "@/components/Shared/Input/InputText";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import FilterOperator from "./FilterOperator";

export type FilterI = { header: string };

export default function Filter({ header }: FilterI) {
  const { t: te } = useTranslation("explorer");

  const { filters, setFilters, filtersOperator, structure } =
    useResourceContext();

  const handleChangeFilter = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="grow">
        <InputText
          label={header}
          name={header}
          value={filters[header] ?? ""}
          onChange={handleChangeFilter}
          hasHelperText
          helperText={
            <div className="flex flex-row gap-8 items-center">
              {structure && <FilterOperator header={header} />}
              <span>
                {te("filters.operatorType", {
                  operator: te(`filters.operators.${filtersOperator[header]}`),
                })}
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}
