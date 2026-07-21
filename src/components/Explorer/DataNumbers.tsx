import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";

export default function DataNumbers() {
  const { t: te } = useTranslation("explorer");

  const {
    isLoadingData,
    isLoadingStructure,
    data,
    total,
    totalFiltered,
    nFiltersApplied,
  } = useResourceContext();

  if (isLoadingData || isLoadingStructure || data === null) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-16 w-full">
      <div className="w-fit">
        <b>{te("views.dataNumbers.total")}:</b> {total}
      </div>
      <div className="w-fit">
        <b>{te("views.dataNumbers.totalFiltered")}:</b> {totalFiltered}
      </div>
      <div className="w-fit">
        <b>{te("views.dataNumbers.appliedFilters")}:</b> {nFiltersApplied}
      </div>
    </div>
  );
}
