"use client";

import { useTranslation } from "react-i18next";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useChartContext } from "@/hooks/useChartContext";
import ChartSelectors from "../Chart/ChartSelectors";
import ChartRenderer from "../Chart/ChartRenderer";
import ChartPagination from "../Chart/ChartPagination";
import { ChartProvider } from "@/providers/ChartProvider";

function ChartContent() {
  const { t: te } = useTranslation("explorer");
  const { data } = useResourceContext();
  const { hasNumericData } = useChartContext();

  const hasData = (data?.data ?? []).length > 0;

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
      <ChartPagination />
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
