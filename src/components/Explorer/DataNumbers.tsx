import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";
import Pill from "../Shared/Pill/Pill";

export default function DataNumbers() {
  const { t: te } = useTranslation("explorer");

  const { data, total, totalFiltered, nFiltersApplied } = useResourceContext();

  if (data === null) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-16 w-full">
      <div className="w-fit">
        <b>{te("dataNumbers.total")}:</b> <Pill>{total}</Pill>
      </div>
      <div className="w-fit">
        <b>{te("dataNumbers.totalFiltered")}:</b> <Pill>{totalFiltered}</Pill>
      </div>
      <div className="w-fit">
        <b>{te("dataNumbers.appliedFilters")}:</b>{" "}
        <Pill>{nFiltersApplied}</Pill>
      </div>
    </div>
  );
}
