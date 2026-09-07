import { DataContext } from "@/providers/ResourceProvider";
import { useContext } from "react";

export function useDataContext() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within ResourceProvider");
  }

  return context;
}
