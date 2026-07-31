"use client";

import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useResourceContext } from "@/hooks/useResourceContext";
import { CHART_TYPES_WITH_R, ChartType } from "@/services/types/charts";
import { Chart as ChartJS } from "chart.js";

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

  chartRef: MutableRefObject<ChartJS | null>;
  exportChartAsPng: () => void;
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

  const chartRef = useRef<ChartJS | null>(null);

  const showR = CHART_TYPES_WITH_R.includes(chart);
  const hasNumericData = numericKeys.length > 0;

  const exportChartAsPng = useCallback(() => {
    const instance = chartRef.current;
    if (!instance) return;

    const url = instance.toBase64Image("image/png", 1);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  }, []);

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
      chartRef,
      exportChartAsPng,
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
      exportChartAsPng,
    ],
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}
