import { ChartContext, ChartContextType } from "@/providers/ChartProvider";
import { useContext } from "react";

export function useChartContext(): ChartContextType {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider");
  }
  return context;
}
