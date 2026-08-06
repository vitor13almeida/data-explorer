"use client";

import InputText from "@/components/Shared/Input/InputText";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FilterOperator from "./FilterOperator";
import { useFilterValidation } from "@/hooks/useFilterValidation";
import {
  TriStateInput,
  TriStateInputValue,
} from "@/components/Shared/Input/TriStateInput";
import FilterVisibility from "./FilterVisibility";

export type FilterI = { header: string };

function getInputType(
  format: string,
  pythonType: string,
): { type: string; placeholder: string; maxLength?: number } {
  switch (format) {
    case "year":
      return { type: "year", placeholder: "YYYY" };
    case "date":
      return { type: "date", placeholder: "YYYY-MM-DD" };
    case "url":
      return { type: "string", placeholder: "https://..." };
    case "bool":
      return { type: "bool", placeholder: "" };
    case "latlon_wgs":
      return { type: "latlon", placeholder: "lat,lon" };
    case "iso_country_code_alpha2":
      return { type: "string", placeholder: "PT", maxLength: 2 };
  }

  switch (pythonType) {
    case "int":
      return { type: "int", placeholder: "0" };
    case "float":
      return { type: "float", placeholder: "0.00" };
    case "date":
      return { type: "date", placeholder: "YYYY-MM-DD" };
    case "bool":
      return { type: "bool", placeholder: "" };
    default:
      return { type: "string", placeholder: "" };
  }
}

export default function Filter({ header }: FilterI) {
  const { t: te } = useTranslation("explorer");

  const {
    filters,
    setFilters,
    removeFilter,
    filtersOperator,
    structure,
    setInvalidFilters,
  } = useResourceContext();

  const { errors, isValid } = useFilterValidation(
    filters,
    filtersOperator,
    structure,
    te,
  );

  const handleChangeFilter = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeBoolFilter = (name: string, value: TriStateInputValue) => {
    if (value === null) {
      removeFilter(name);
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    setInvalidFilters(!isValid);
  }, [isValid]);

  const column = structure?.profile.columns?.[header];
  const format = column?.format ?? "string";
  const pythonType = column?.python_type ?? "string";
  const { type, placeholder, maxLength } = getInputType(format, pythonType);

  const getInput = () => {
    if (type === "bool") {
      return (
        <TriStateInput
          label={header}
          name={header}
          value={filters[header] ?? null}
          onChange={(value) => handleChangeBoolFilter(header, value)}
        />
      );
    }

    return (
      <InputText
        label={header}
        name={header}
        value={filters[header] ?? ""}
        onChange={handleChangeFilter}
        placeholder={placeholder}
        hasHelperText
        hasError={!!errors[header]}
        errorFeedbackText={errors[header]}
        maxLength={maxLength}
      />
    );
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="grow">
        <div className="flex flex-col gap-8">
          {getInput()}
          {structure && (
            <>
              <div className="flex flex-row gap-8 items-center text-neutral-700">
                <FilterOperator header={header} />
                <span>
                  {te("filters.operatorType", {
                    operator: te(
                      `filters.operators.${filtersOperator[header]}`,
                    ),
                  })}
                </span>
              </div>
              <FilterVisibility header={header} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
