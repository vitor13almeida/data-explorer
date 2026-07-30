"use client";

import { createContext, Dispatch, ReactNode, useMemo, useState } from "react";
import { useResourceContext } from "@/hooks/useResourceContext";
import { CHART_TYPES_WITH_R } from "@/services/types/charts";
import { ChartType } from "chart.js";

export type ChartContextType = {
  keys: string[];
  numericKeys: string[];
  data: Record<string, any>[];

  xAxisKey: string;
  setXAxisKey: Dispatch<string>;
  yAxisKey: string;
  setYAxisKey: Dispatch<string>;
  rAxisKey: string;
  setRAxisKey: Dispatch<string>;

  chart: ChartType;
  setChart: Dispatch<ChartType>;
  showR: boolean;

  hasData: boolean;
  hasNumericData: boolean;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export function ChartProvider({ children }: { children: ReactNode }) {
  const { data: resourceData } = useResourceContext();

  const rows = useMemo(
    () => (resourceData?.data ?? []).map(({ __id, ...rest }) => rest),
    [resourceData],
  );

  const keys = useMemo(
    () => (rows.length > 0 ? Object.keys(rows[0]) : []),
    [rows],
  );

  const numericKeys = useMemo(
    () => keys.filter((k) => rows.some((d) => !isNaN(Number(d[k])))),
    [keys, rows],
  );

  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");
  const [rAxisKey, setRAxisKey] = useState("");
  const [chart, setChart] = useState<ChartType>("Line");

  const showR = CHART_TYPES_WITH_R.includes(chart);
  const hasData = rows.length > 0;
  const hasNumericData = numericKeys.length > 0;

  // initialise defaults when data arrives
  useMemo(() => {
    if (keys.length > 0 && !xAxisKey) setXAxisKey(keys[0]);
    if (numericKeys.length > 0 && !yAxisKey) setYAxisKey(numericKeys[0]);
  }, [keys, numericKeys]);

  const value = useMemo(
    () => ({
      keys,
      numericKeys,
      data: rows,
      xAxisKey,
      setXAxisKey,
      yAxisKey,
      setYAxisKey,
      rAxisKey,
      setRAxisKey,
      chart,
      setChart,
      showR,
      hasData,
      hasNumericData,
    }),
    [
      keys,
      numericKeys,
      rows,
      xAxisKey,
      yAxisKey,
      rAxisKey,
      chart,
      showR,
      hasData,
      hasNumericData,
    ],
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}
