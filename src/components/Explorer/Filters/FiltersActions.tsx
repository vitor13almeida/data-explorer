"use client";

import Button from "@/components/Shared/Button/Button";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";

export default function FiltersActions() {
  const { t: te } = useTranslation("explorer");

  const { nHeadersVisible, applyFilters, clearFilters, invalidFilters } = useResourceContext();

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="flex flex-row flex-wrap items-end justify-end gap-32">
      <Button
        onClick={() => handleClearFilters()}
        hasIcon
        leadingIcon="agora-line-trash"
        leadingIconHover="agora-line-trash"
        appearance="link"
      >
        {te("actions.clear")}
      </Button>
      <Button onClick={() => handleApplyFilters()} disabled={invalidFilters || nHeadersVisible < 1}>
        {te("actions.filter")}
      </Button>
    </div>
  );
}
