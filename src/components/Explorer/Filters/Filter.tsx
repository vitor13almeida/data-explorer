"use client";

import InputText from "@/components/Shared/Input/InputText";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FilterOperator from "./FilterOperator";
import { useFilterValidation } from "@/hooks/useFilterValidation";
import { getDataType } from "@/services/utils/data";
import {
  TriStateSwitch,
  TriStateSwitchValue,
} from "@/components/Shared/Input/TriStateSwitch";

export type FilterI = { header: string };

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

  const handleChangeBoolFilter = (name: string, value: TriStateSwitchValue) => {
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

  const dataType = getDataType(header, structure);

  const getInput = () => {
    switch (dataType) {
      case "bool":
        return (
          <div className="flex flex-col gap-8">
            <TriStateSwitch
              label={header}
              name={header}
              value={filters[header] ?? null}
              onChange={(value) => handleChangeBoolFilter(header, value)}
            />
            <div className="flex flex-row gap-8 items-center text-neutral-700">
              {structure && <FilterOperator header={header} />}
              <span>
                {te("filters.operatorType", {
                  operator: te(`filters.operators.${filtersOperator[header]}`),
                })}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <InputText
            label={header}
            name={header}
            value={filters[header] ?? ""}
            onChange={handleChangeFilter}
            hasHelperText
            helperText={
              <div className="flex flex-row gap-8 items-center text-neutral-700">
                {structure && <FilterOperator header={header} />}
                <span>
                  {te("filters.operatorType", {
                    operator: te(
                      `filters.operators.${filtersOperator[header]}`,
                    ),
                  })}
                </span>
              </div>
            }
            hasError={!!errors[header]}
            errorFeedbackText={errors[header]}
          />
        );
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="grow">{getInput()}</div>
    </div>
  );
}
