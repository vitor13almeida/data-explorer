"use client";

import { useTranslation } from "react-i18next";
import TableView from "./Views/TableView";
import Button from "../Shared/Button/Button";
import ButtonGroup from "../Shared/Button/ButtonGroup";
import { useState } from "react";
import Filters from "./Filters/Filters";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DataNumbers from "./DataNumbers";
import StructureView from "./Views/StructureView";
import MetricsView from "./Views/MetricsView";
import ChartView from "./Views/ChartView";
import { ViewType } from "@/services/types";
import { VIEW_TYPES } from "@/services/consts/explorer";
import ExplorerActions from "./Actions/ExplorerActions";

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

  const [selectedView, setSelectedView] = useState<ViewType>("table");

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
      <div className="w-full flex flex-col gap-16">
        <ExplorerView selectedView={selectedView} />
      </div>
    </div>
  );
}
