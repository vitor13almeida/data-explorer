import { ViewContext } from "@/providers/ResourceProvider";
import { useContext } from "react";

export function useViewContext() {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("useViewContext must be used within ResourceProvider");
  }

  return context;
}
