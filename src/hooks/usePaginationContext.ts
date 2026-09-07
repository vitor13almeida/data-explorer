import { PaginationContext } from "@/providers/ResourceProvider";
import { useContext } from "react";

export function usePaginationContext() {
  const context = useContext(PaginationContext);

  if (!context) {
    throw new Error("usePaginationContext must be used within ResourceProvider");
  }

  return context;
}
