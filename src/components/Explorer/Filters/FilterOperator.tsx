"use client";

import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import InputSelect from "@/components/Shared/Input/InputSelect";
import { useDataContext } from "@/hooks/useDataContext";
import { useFiltersContext } from "@/hooks/useFiltersContext";
import { FilterOperatorType } from "@/services/types";
import { getDataType, getOperatorOptions } from "@/services/utils/data";
import { DropdownOptionProps } from "@ama-pt/agora-design-system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type FilterOperatorI = {
  header: string;
};

export default function FilterOperator({ header }: FilterOperatorI) {
  const { t: te } = useTranslation("explorer");
  const { structure } = useDataContext();
  const { filtersOperator, setFiltersOperator } = useFiltersContext();

  const dataType = getDataType(header, structure);

  const options = useMemo(() => {
    const opts = getOperatorOptions(dataType);
    return opts.map((o) => (
      <DropdownOption value={o} key={o} selected={o === filtersOperator[header]}>
        {`${te("filters.operator")}: ${te(`filters.operators.${o}`)}`}
      </DropdownOption>
    ));
  }, [dataType, filtersOperator, header]);

  const handleChange = (options: DropdownOptionProps[]) => {
    const nextSelected = options.map((o) => o.value);
    setFiltersOperator({
      ...filtersOperator,
      [header]: (nextSelected.at(0) ?? "contains") as FilterOperatorType,
    });
  };

  if (structure === null) {
    return null;
  }

  return (
    <div className="w-full [&_.agora-input-select-label]:hidden">
      <InputSelect
        hasIcon
        icon="agora-line-settings"
        //label={te("filters.operator")}
        onChange={handleChange}
        hideSectionNames
        className="h-256 w-full"
      >
        <DropdownSection name="operador">{options}</DropdownSection>
      </InputSelect>
    </div>
  );
}
