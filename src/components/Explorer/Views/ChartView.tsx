"use client";

import { useChartContext } from "@/hooks/useChartContext";
import { useTranslation } from "react-i18next";
import ChartSelectors from "../Chart/ChartSelectors";
import ChartRenderer from "../Chart/ChartRenderer";
import { ChartProvider } from "@/providers/ChartProvider";

function ChartContent() {
  const { t: te } = useTranslation("explorer");
  const { hasData, hasNumericData } = useChartContext();

  if (!hasData) {
    return (
      <p className="text-m-regular text-neutral-500">
        {te("views.chart.noData")}
      </p>
    );
  }

  if (!hasNumericData) {
    return (
      <p className="text-m-regular text-neutral-500">
        {te("views.chart.noNumericData")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-24">
      <ChartSelectors />
      <ChartRenderer />
    </div>
  );
}

export default function ChartView() {
  return (
    <ChartProvider>
      <ChartContent />
    </ChartProvider>
  );
}
