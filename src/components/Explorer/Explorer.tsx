"use client";

import { useTranslation } from "react-i18next";
import TableView from "./Views/TableView";
import Button from "../Shared/Button/Button";
import ButtonGroup from "../Shared/Button/ButtonGroup";
import { useMemo, useState } from "react";
import FiltersToogle from "./Filters/FiltersToogle";
import Filters from "./Filters/Filters";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DataNumbers from "./DataNumbers";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useChartContext } from "@/hooks/useChartContext";
import { exportToCsv } from "@/utils/exportToCsv";
import StructureView from "./Views/StructureView";
import MetricsView from "./Views/MetricsView";
import ChartView from "./Views/ChartView";

const VIEW_TYPES = ["table", "structure", "metrics", "chart"] as const;

type ViewType = (typeof VIEW_TYPES)[number];

function ChartActions() {
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data } = useResourceContext();
  const { exportChartAsPng, toggleFullscreen } = useChartContext();

  const hasData = !isLoadingData && data && data.data.length > 0;

  return (
    <>
      <Button
        iconOnly
        hasIcon
        leadingIcon="agora-line-bar-chart"
        leadingIconHover="agora-line-bar-chart"
        title={te("actions.exportChart")}
        appearance="outline"
        disabled={!hasData}
        onClick={exportChartAsPng}
      />
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

function ExplorerActions({ selectedView }: { selectedView: ViewType }) {
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data } = useResourceContext();

  const hasData = !isLoadingData && data && data.data.length > 0;

  const handleClickExportCsv = () => {
    if (hasData) {
      exportToCsv(data.data);
    }
  };

  return (
    <div className="flex flex-row gap-8 flex-wrap shrink">
      <FiltersToogle />
      <Button
        iconOnly
        hasIcon
        leadingIcon="agora-line-document"
        leadingIconHover="agora-line-document"
        title={te("actions.exportCsv")}
        appearance="outline"
        disabled={!hasData}
        onClick={handleClickExportCsv}
      />
      {selectedView === "chart" && <ChartActions />}
    </div>
  );
}

export default function Explorer() {
  const { t: te } = useTranslation("explorer");

  const isMobile = useMediaQuery("(min-width: 768px)");

  const [selectedView, setSelectedView] = useState<ViewType>("table");

  const view = useMemo(() => {
    switch (selectedView) {
      case "table":
        return (
          <>
            <DataNumbers />
            <TableView />
          </>
        );
      case "structure":
        return <StructureView />;
      case "metrics":
        return <MetricsView />;
      case "chart":
        return (
          <>
            <DataNumbers />
            <ChartView />
          </>
        );
      default:
        return null;
    }
  }, [selectedView]);

  return (
    <div className="w-full flex flex-col gap-32">
      <div className="flex flex-col md:flex-row gap-32 md:gap-64 w-full items-center">
        <div className="grow w-full md:w-auto">
          <ButtonGroup orientation={isMobile ? "vertical" : "horizontal"}>
            {VIEW_TYPES.map((view) => (
              <Button key={view} onClick={() => setSelectedView(view)}>
                {te(`views.${view}.title`)}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <ExplorerActions selectedView={selectedView} />
      </div>
      <div className="w-full">
        <Filters />
      </div>
      <div className="w-full flex flex-col gap-16">{view}</div>
    </div>
  );
}
