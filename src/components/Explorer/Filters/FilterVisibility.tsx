"use client";

import Switch from "@/components/Shared/Input/Switch";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";

export type FilterVisibilityI = { header: string };

export default function FilterVisibility({ header }: FilterVisibilityI) {
  const { t: te } = useTranslation("explorer");

  const { headersVisibility, setHeadersVisibility } = useResourceContext();

  const value: boolean = headersVisibility[header] ?? true;

  const handleChange = () => {
    setHeadersVisibility({ ...headersVisibility, [header]: !value });
  };

  return (
    <Switch
      label={te(`filters.${value === true ? "visible" : "invisible"}`)}
      checked={value}
      onChange={handleChange}
      className="[&_.switch-label]:text-neutral-700"
    />
  );
}
