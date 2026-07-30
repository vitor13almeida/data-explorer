"use client";

import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import InputSelect from "@/components/Shared/Input/InputSelect";
import { useChartContext } from "@/hooks/useChartContext";
import { CHART_TYPES } from "@/services/consts/chart";
import { ChartType } from "@/services/types/charts";
import { DropdownOptionProps } from "@ama-pt/agora-design-system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function useDropdownOptions(
  items: readonly string[],
  selected: string,
  prefix: string,
) {
  return useMemo(
    () => (
      <DropdownSection label={`section-${prefix}`} name={`section-${prefix}`}>
        {items.map((item, index) => (
          <DropdownOption
            key={`${prefix}-${index}`}
            value={item}
            selected={item === selected}
          >
            {item}
          </DropdownOption>
        ))}
      </DropdownSection>
    ),
    [items, selected, prefix],
  );
}

function extractValue(event: DropdownOptionProps[]): string {
  return event[0]?.value ?? "";
}

export default function ChartSelectors() {
  const { t: te } = useTranslation("explorer");

  const {
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
  } = useChartContext();

  const optionsX = useDropdownOptions(keys, xAxisKey, "x");
  const optionsY = useDropdownOptions(numericKeys, yAxisKey, "y");
  const optionsR = useDropdownOptions(numericKeys, rAxisKey, "r");

  const optionsChart = useMemo(
    () => (
      <DropdownSection label="section-chart" name="section-chart">
        {CHART_TYPES.map((type, index) => (
          <DropdownOption
            key={`chart-${index}`}
            value={type}
            selected={String(type) === String(chart)}
          >
            {te(`views.chart.types.${type}`)}
          </DropdownOption>
        ))}
      </DropdownSection>
    ),
    [chart, te],
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-16">
      <div className="col-span-2 lg:col-span-3">
        <InputSelect
          label={te("views.chart.xAxis")}
          placeholder={te("views.chart.axisPlaceholder")}
          multiple={false}
          hideSectionNames
          value={xAxisKey}
          onChange={(e: DropdownOptionProps[]) => setXAxisKey(extractValue(e))}
        >
          {optionsX}
        </InputSelect>
      </div>

      <div className="col-span-2 lg:col-span-3">
        <InputSelect
          label={te("views.chart.yAxis")}
          placeholder={te("views.chart.axisPlaceholder")}
          multiple={false}
          hideSectionNames
          value={yAxisKey}
          onChange={(e: DropdownOptionProps[]) => setYAxisKey(extractValue(e))}
        >
          {optionsY}
        </InputSelect>
      </div>

      {showR && (
        <div className="col-span-2 lg:col-span-3">
          <InputSelect
            label={te("views.chart.rAxis")}
            placeholder={te("views.chart.axisPlaceholder")}
            multiple={false}
            hideSectionNames
            value={rAxisKey}
            onChange={(e: DropdownOptionProps[]) =>
              setRAxisKey(extractValue(e))
            }
          >
            {optionsR}
          </InputSelect>
        </div>
      )}

      <div className="col-span-2 lg:col-span-3">
        <InputSelect
          label={te("views.chart.chartType")}
          placeholder={te("views.chart.chartTypePlaceholder")}
          multiple={false}
          hideSectionNames
          value={chart}
          onChange={(e: DropdownOptionProps[]) =>
            setChart((extractValue(e) || "Line") as ChartType)
          }
        >
          {optionsChart}
        </InputSelect>
      </div>
    </div>
  );
}
