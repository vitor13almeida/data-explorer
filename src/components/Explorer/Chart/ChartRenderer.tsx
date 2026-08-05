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
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import Button from "@/components/Shared/Button/Button";

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
  const { data: resourceData } = useResourceContext();
  const {
    xAxisKey,
    yAxisKeys,
    rAxisKey,
    chart,
    chartRef,
    chartContainerRef,
    isFullscreen,
    toggleFullscreen,
    exportChartAsPng,
  } = useChartContext();

  const { t: te } = useTranslation("explorer");

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

  let chartToRender = null;

  if (chart === "Bubble") {
    chartToRender = <Bubble ref={handleRef} data={bubbleData} />;
  } else {
    const Component = CHART_COMPONENTS[chart];
    chartToRender = <Component ref={handleRef} data={standardData} />;
  }
  return (
    <div
      ref={chartContainerRef}
      className={twMerge(
        "w-full h-full bg-white flex flex-col gap-16",
        isFullscreen ? "p-32" : "p-0",
      )}
    >
      {isFullscreen && (
        <div className="flex flex-row gap-8 justify-end">
          <Button
            iconOnly
            hasIcon
            leadingIcon="agora-line-bar-chart"
            leadingIconHover="agora-line-bar-chart"
            title={te("actions.exportChart")}
            appearance="outline"
            onClick={exportChartAsPng}
          />
          <Button
            iconOnly
            hasIcon
            leadingIcon="agora-line-minimize"
            leadingIconHover="agora-line-minimize"
            title={te("actions.exitFullscreen")}
            appearance="outline"
            onClick={toggleFullscreen}
          />
        </div>
      )}
      {chartToRender}
    </div>
  );
}
