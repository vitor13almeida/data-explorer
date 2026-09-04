import { FiltersContext } from "@/providers/ResourceProvider";
import { useContext } from "react";

export function useFiltersContext() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFiltersContext must be used within ResourceProvider");
  }

  return context;
}
