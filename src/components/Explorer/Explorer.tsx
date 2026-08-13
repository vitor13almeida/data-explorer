"use client";

import { useTranslation } from "react-i18next";
import TableView from "./Views/TableView";
import Filters from "./Filters/Filters";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DataNumbers from "./DataNumbers";
import StructureView from "./Views/StructureView";
import MetricsView from "./Views/MetricsView";
import ChartView from "./Views/ChartView";
import { ViewType } from "@/services/types";
import { VIEW_TYPES, VIEW_TYPES_ICONS } from "@/services/consts/explorer";
import ExplorerActions from "./Actions/ExplorerActions";
import { useResourceContext } from "@/hooks/useResourceContext";
import ToggleGroup from "../Shared/Toggle/ToggleGroup";
import Toggle from "../Shared/Toggle/Toggle";

type ExplorerViewI = { selectedView: ViewType };

function ExplorerView({ selectedView }: ExplorerViewI) {
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
}

export default function Explorer() {
  const { t: te } = useTranslation("explorer");

  const isMobile = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  const { view, setView } = useResourceContext();

  return (
    <div className="w-full flex flex-col gap-32">
      <div className="flex flex-col lg:flex-row gap-32 w-full items-center justify-between">
        <div className="w-full lg:w-auto">
          <ToggleGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            value={[view]}
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
        </div>
        <ExplorerActions selectedView={view} />
      </div>
      <div className="w-full">
        <Filters />
      </div>
      <div className="w-full flex flex-col gap-16">
        <ExplorerView selectedView={view} />
      </div>
    </div>
  );
}
