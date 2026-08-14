"use client";

import Button from "@/components/Shared/Button/Button";
import { useChartContext } from "@/hooks/useChartContext";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";

export default function ChartActions() {
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data } = useResourceContext();
  const { exportChartAsPng, toggleFullscreen } = useChartContext();

  const hasData = !isLoadingData && data && data.data.length > 0;

  return (
    <>
      <Button
        hasIcon
        leadingIcon="agora-line-bar-chart"
        leadingIconHover="agora-line-bar-chart"
        title={te("actions.exportChart")}
        appearance="outline"
        disabled={!hasData}
        onClick={exportChartAsPng}
      >
        {te("actions.exportChart")}
      </Button>
      <Button
        iconOnly
        hasIcon
        leadingIcon="agora-line-maximize"
        leadingIconHover="agora-line-maximize"
        title={te("actions.fullscreen")}
        appearance="outline"
        disabled={!hasData}
        onClick={toggleFullscreen}
      />
    </>
  );
}
