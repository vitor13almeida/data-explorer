"use client";

import { useMemo } from "react";
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
import { ChartType } from "@/services/types/charts";
import { useChartContext } from "@/hooks/useChartContext";
import { CHART_COLOR } from "@/services/consts/chart";

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

const CHART_COMPONENTS: Record<Exclude<ChartType, "Bubble">, typeof Line> = {
  Line,
  Bar,
  Radar,
  Doughnut,
  "Polar Area": PolarArea,
  Pie,
  Scatter,
};

export default function ChartRenderer() {
  const { data, xAxisKey, yAxisKey, rAxisKey, chart } = useChartContext();

  const standardData = useMemo(
    () => ({
      labels: data.map((d) => d[xAxisKey] ?? ""),
      datasets: [
        {
          label: yAxisKey,
          data: data.map((d) => Number(d[yAxisKey])),
          borderColor: CHART_COLOR.border,
          backgroundColor: CHART_COLOR.background,
        },
      ],
    }),
    [data, xAxisKey, yAxisKey],
  );

  const bubbleData = useMemo(
    () => ({
      datasets: [
        {
          label: `${yAxisKey} vs ${xAxisKey}`,
          data: data.map((d) => ({
            x: Number(d[xAxisKey]),
            y: Number(d[yAxisKey]),
            r: Number(d[rAxisKey] || 5),
          })),
          borderColor: CHART_COLOR.border,
          backgroundColor: CHART_COLOR.background,
        },
      ],
    }),
    [data, xAxisKey, yAxisKey, rAxisKey],
  );

  if (chart === "Bubble") {
    return <Bubble data={bubbleData} />;
  }

  const Component = CHART_COMPONENTS[chart];
  return <Component data={standardData as any} />;
}
