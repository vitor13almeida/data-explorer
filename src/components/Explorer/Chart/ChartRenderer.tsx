"use client";

import { useMemo, useCallback, ComponentType } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  BubbleController,
  ScatterController,
  LineController,
  BarController,
  RadarController,
  DoughnutController,
  PolarAreaController,
  PieController,
} from "chart.js";
import {
  Line,
  Bar,
  Radar,
  Doughnut,
  PolarArea,
  Bubble,
  Pie,
  Scatter,
} from "react-chartjs-2";
import { useChartContext } from "@/hooks/useChartContext";
import { useResourceContext } from "@/hooks/useResourceContext";
import { ChartType } from "@/services/types/charts";
import { getChartColor } from "@/services/utils/charts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  BarController,
  RadarController,
  DoughnutController,
  PolarAreaController,
  BubbleController,
  PieController,
  ScatterController,
);

const CHART_COMPONENTS: Record<
  Exclude<ChartType, "Bubble">,
  ComponentType<any>
> = {
  Line,
  Bar,
  Radar,
  Doughnut,
  "Polar Area": PolarArea,
  Pie,
  Scatter,
};

export default function ChartRenderer() {
  const { xAxisKey, yAxisKeys, rAxisKey, chart, chartRef } = useChartContext();
  const { data: resourceData } = useResourceContext();

  const rows = useMemo(
    () => (resourceData?.data ?? []).map(({ __id, ...rest }) => rest),
    [resourceData],
  );

  const handleRef = useCallback(
    (instance: ChartJS | undefined | null) => {
      chartRef.current = instance ?? null;
    },
    [chartRef],
  );

  const standardData = useMemo(
    () => ({
      labels: rows.map((d) => d[xAxisKey] ?? ""),
      datasets: yAxisKeys.map((key, index) => {
        const color = getChartColor(index);
        return {
          label: key,
          data: rows.map((d) => Number(d[key])),
          borderColor: color.border,
          backgroundColor: color.background,
        };
      }),
    }),
    [rows, xAxisKey, yAxisKeys],
  );

  const bubbleData = useMemo(
    () => ({
      datasets: yAxisKeys.map((key, index) => {
        const color = getChartColor(index);
        return {
          label: `${key} vs ${xAxisKey}`,
          data: rows.map((d) => ({
            x: Number(d[xAxisKey]),
            y: Number(d[key]),
            r: Number(d[rAxisKey] || 5),
          })),
          borderColor: color.border,
          backgroundColor: color.background,
        };
      }),
    }),
    [rows, xAxisKey, yAxisKeys, rAxisKey],
  );

  if (rows.length === 0 || yAxisKeys.length === 0) return null;

  if (chart === "Bubble") {
    return <Bubble ref={handleRef} data={bubbleData} />;
  }

  const Component = CHART_COMPONENTS[chart];
  return <Component ref={handleRef} data={standardData} />;
}
