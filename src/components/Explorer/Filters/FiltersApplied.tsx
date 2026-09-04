import { Typograph } from "@/components/Shared/Typograph/Typograph";
import { useResourceContext } from "@/hooks/useResourceContext";
import { Tag } from "@ama-pt/agora-design-system";
import { useTranslation } from "react-i18next";

export default function FiltersApplied() {
  const { t: te } = useTranslation("explorer");
  const { nFiltersApplied, appliedFilters, removeFilter } = useResourceContext();

  const handleClick = (key: string) => {
    removeFilter(key);
  };

  if (nFiltersApplied < 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-16">
      <Typograph tag="p" className="text-m-bold text-primary-900">
        {`${te("filters.selected")} (${nFiltersApplied})`}
      </Typograph>
      <div className="flex flex-wrap gap-16">
        {Object.entries(appliedFilters).map(([key, value]) => {
          if (value) {
            return <Tag key={key} children={`${key}: ${value}`} onClick={() => handleClick(key)} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
