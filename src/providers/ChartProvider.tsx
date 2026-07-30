"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useResourceContext } from "@/hooks/useResourceContext";
import { CHART_TYPES_WITH_R, ChartType } from "@/services/types/charts";

export type ChartContextType = {
  keys: string[];
  numericKeys: string[];

  xAxisKey: string;
  setXAxisKey: Dispatch<string>;
  yAxisKey: string;
  setYAxisKey: Dispatch<string>;
  rAxisKey: string;
  setRAxisKey: Dispatch<string>;

  chart: ChartType;
  setChart: Dispatch<ChartType>;
  showR: boolean;

  hasNumericData: boolean;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export function ChartProvider({ children }: { children: ReactNode }) {
  const { data: resourceData } = useResourceContext();

  const rows = resourceData?.data ?? [];

  const keys = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter((k) => k !== "__id");
  }, [rows]);

  const numericKeys = useMemo(
    () => keys.filter((k) => rows.some((d) => !isNaN(Number(d[k])))),
    [keys, rows],
  );

  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");
  const [rAxisKey, setRAxisKey] = useState("");
  const [chart, setChart] = useState<ChartType>("Line");

  const showR = CHART_TYPES_WITH_R.includes(chart);
  const hasNumericData = numericKeys.length > 0;

  useEffect(() => {
    if (keys.length > 0 && !xAxisKey) setXAxisKey(keys[0]);
    if (numericKeys.length > 0 && !yAxisKey) setYAxisKey(numericKeys[0]);
  }, [keys, numericKeys]);

  const value = useMemo(
    () => ({
      keys,
      numericKeys,
      xAxisKey,
      setXAxisKey,
      yAxisKey,
      setYAxisKey,
      rAxisKey,
      setRAxisKey,
      chart,
      setChart,
      showR,
      hasNumericData,
    }),
    [
      keys,
      numericKeys,
      xAxisKey,
      yAxisKey,
      rAxisKey,
      chart,
      showR,
      hasNumericData,
    ],
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}
