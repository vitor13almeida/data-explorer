"use client";

import {
  createContext,
  Dispatch,
  RefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useResourceContext } from "@/hooks/useResourceContext";
import { Chart as ChartJS } from "chart.js";
import { CHART_TYPES_WITH_R, ChartType } from "@/services/types/charts";
import { CHART_TYPES_SINGLE_DATASET } from "@/services/consts/chart";

export type ChartContextType = {
  keys: string[];
  numericKeys: string[];

  xAxisKey: string;
  setXAxisKey: Dispatch<string>;
  yAxisKeys: string[];
  setYAxisKeys: Dispatch<string[]>;
  rAxisKey: string;
  setRAxisKey: Dispatch<string>;

  chart: ChartType;
  setChart: Dispatch<ChartType>;
  showR: boolean;
  multipleDatasets: boolean;

  hasNumericData: boolean;

  chartRef: RefObject<ChartJS | null>;
  chartContainerRef: RefObject<HTMLDivElement | null>;
  exportChartAsPng: () => void;
  toggleFullscreen: () => void;
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
  const [yAxisKeys, setYAxisKeys] = useState<string[]>([]);
  const [rAxisKey, setRAxisKey] = useState("");
  const [chart, setChart] = useState<ChartType>("Line");

  const chartRef = useRef<ChartJS | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const showR = CHART_TYPES_WITH_R.includes(chart);
  const multipleDatasets = !CHART_TYPES_SINGLE_DATASET.includes(chart);
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

  const toggleFullscreen = useCallback(() => {
    const element = chartContainerRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    if (keys.length > 0 && !xAxisKey) setXAxisKey(keys[0]);
    if (numericKeys.length > 0 && yAxisKeys.length === 0)
      setYAxisKeys([numericKeys[0]]);
  }, [keys, numericKeys]);

  useEffect(() => {
    if (!multipleDatasets && yAxisKeys.length > 1) {
      setYAxisKeys([yAxisKeys[0]]);
    }
  }, [multipleDatasets]);

  const value = useMemo(
    () => ({
      keys,
      numericKeys,
      xAxisKey,
      setXAxisKey,
      yAxisKeys,
      setYAxisKeys,
      rAxisKey,
      setRAxisKey,
      chart,
      setChart,
      showR,
      multipleDatasets,
      hasNumericData,
      chartRef,
      chartContainerRef,
      exportChartAsPng,
      toggleFullscreen,
    }),
    [
      keys,
      numericKeys,
      xAxisKey,
      yAxisKeys,
      rAxisKey,
      chart,
      showR,
      multipleDatasets,
      hasNumericData,
      exportChartAsPng,
      toggleFullscreen,
    ],
  );

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}
