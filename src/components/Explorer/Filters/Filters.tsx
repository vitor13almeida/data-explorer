"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import Filter from "./Filter";
import FiltersActions from "./FiltersActions";
import FiltersApplied from "./FiltersApplied";

export default function Filters() {
  const { headers } = useResourceContext();

  return (
    <>
      <div className="grid w-full grid-cols-12 items-end gap-x-32 gap-y-32 md:gap-y-64">
        {headers.map((header, index) => {
          return (
            <div key={`filter-header-${index}`} className="col-span-12 md:col-span-6">
              <Filter header={header} />
            </div>
          );
        })}
        <div className="col-span-12">
          <FiltersApplied />
        </div>
        <div className="col-span-12 mb-64 md:mb-128">
          <FiltersActions />
        </div>
      </div>
    </>
  );
}
