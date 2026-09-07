"use client";

import { useTranslation } from "react-i18next";
import TableView from "./Views/TableView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import StructureView from "./Views/StructureView";
import MetricsView from "./Views/MetricsView";
import ChartView from "./Views/ChartView";
import { ViewType } from "@/services/types";
import { VIEW_TYPES, VIEW_TYPES_ICONS } from "@/services/consts/explorer";
import ExplorerActions from "./Actions/ExplorerActions";
import { useDataContext } from "@/hooks/useDataContext";
import { useViewContext } from "@/hooks/useViewContext";
import ToggleGroup from "../Shared/Toggle/ToggleGroup";
import Toggle from "../Shared/Toggle/Toggle";
import { twJoin } from "tailwind-merge";
import Button from "../Shared/Button/Button";

type ExplorerViewI = { selectedView: ViewType };

function ExplorerView({ selectedView }: ExplorerViewI) {
  switch (selectedView) {
    case "table":
      return (
        <>
          {/*<DataNumbers />*/}
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
          {/*<DataNumbers />*/}
          <ChartView />
        </>
      );
    default:
      return null;
  }
}

export default function Explorer() {
  const { t: te } = useTranslation("explorer");

  const isMobile = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  const { isLoadingData, data } = useDataContext();
  const { view, setView, explorerContainerRef, isFullscreen, toggleFullscreen } =
    useViewContext();

  const hasData = !isLoadingData && !!data && data.data.length > 0;

  return (
    <div className={"w-full flex flex-col gap-32"}>
      <ToggleGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        value={[view]}
        fullWidth
      >
        {VIEW_TYPES.map((viewType) => (
          <Toggle
            key={viewType}
            value={viewType}
            multiple={false}
            onClick={() => setView(viewType)}
            hasIcon
            leadingIcon={VIEW_TYPES_ICONS[viewType]}
            leadingIconHover={VIEW_TYPES_ICONS[viewType]}
          >
            {te(`views.${viewType}.title`)}
          </Toggle>
        ))}
      </ToggleGroup>

      <ExplorerActions selectedView={view} />

      <div
        ref={explorerContainerRef}
        className={twJoin(
          "w-full flex flex-col gap-16",
          isFullscreen ? "bg-white p-32 overflow-y-auto h-full" : "p-0",
        )}
      >
        {isFullscreen && (
          <Button
            hasIcon
            trailingIcon={"agora-line-minimize"}
            trailingIconHover={"agora-line-minimize"}
            title={te("actions.exitFullscreen")}
            appearance="link"
            variant="neutral"
            disabled={!hasData}
            onClick={toggleFullscreen}
          >
            {te("actions.exitFullscreen")}
          </Button>
        )}

        <ExplorerView selectedView={view} />
      </div>
    </div>
  );
}
