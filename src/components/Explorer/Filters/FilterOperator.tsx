"use client";

import Button from "@/components/Shared/Button/Button";
import Drawer from "@/components/Shared/Drawer/Button";
import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import InputSelect from "@/components/Shared/Input/InputSelect";
import { useResourceContext } from "@/hooks/useResourceContext";
import {
  FilterOperatorCommon,
  FilterOperatorDate,
  FilterOperatorNumber,
  FilterOperatorText,
} from "@/services/consts/explorer";
import { FilterOperatorType } from "@/services/types/Resources";
import {
  DrawerElement,
  DropdownOptionProps,
} from "@ama-pt/agora-design-system";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

export type FilterOperatorI = {
  header: string;
};

export default function FilterOperator({ header }: FilterOperatorI) {
  const { t } = useTranslation("common");
  const { t: te } = useTranslation("explorer");
  const { structure, filtersOperator, setFiltersOperator } =
    useResourceContext();

  const dataType = structure?.profile.columns[header].python_type;

  const ref = useRef<DrawerElement>(null);

  const options = useMemo(() => {
    let arr: string[] = [];
    switch (dataType) {
      case "string":
        arr = [...FilterOperatorText];
        break;
      case "int":
      case "float":
        arr = [...FilterOperatorNumber];
        break;
      case "date":
        arr = [...FilterOperatorDate];
        break;
      default:
        arr = [...FilterOperatorCommon];
        break;
    }
    return arr.map((o) => {
      return (
        <DropdownOption
          value={o}
          key={o}
          selected={o === filtersOperator[header]}
        >
          {te(`filters.operators.${o}`)}
        </DropdownOption>
      );
    });
  }, [dataType, filtersOperator, header]);

  const handleOpenDrawer = () => {
    ref.current?.open();
  };

  const handleCloseDrawer = () => {
    ref.current?.close();
  };

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
    <div className="relative flex w-fit flex-col">
      <Button
        hasIcon
        iconOnly
        trailingIcon={"agora-line-settings"}
        trailingIconHover={"agora-line-settings"}
        appearance={"link"}
        aria-label={te("filters.operatorSelect")}
        onClick={handleOpenDrawer}
        className="operator-drawer-trigger"
      />
      <Drawer ref={ref} position="right">
        <div className="flex flex-col gap-32 w-full h-full p-16">
          <h3 className="text-neutral-900 text-l-bold">{header}</h3>
          <InputSelect
            label={te("filters.operator")}
            onChange={handleChange}
            hideSectionNames
            className="w-full h-256"
          >
            <DropdownSection name={"operador"}>{options}</DropdownSection>
          </InputSelect>
          <Button onClick={handleCloseDrawer}>{t("close")}</Button>
        </div>
      </Drawer>
    </div>
  );
}
