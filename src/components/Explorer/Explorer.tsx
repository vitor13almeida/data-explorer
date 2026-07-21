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

type ViewType = "table" | "structure" | "stats" | "chart";

export default function Explorer() {
  const { t: te } = useTranslation("explorer");

  const isMobbile = useMediaQuery("(min-width: 768px)");

  const [selectedView, setSelectedView] = useState<ViewType>("table");

  const handleSelectView = (view: ViewType) => {
    setSelectedView(view);
  };

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
        return <>{te("views.structure.title")}...</>;
      case "stats":
        return <>{te("views.stats.title")}...</>;
      case "chart":
        return (
          <>
            <DataNumbers />
            <div>{te("views.chart.title")}...</div>
          </>
        );
      default:
        return null;
    }
  }, [selectedView]);

  return (
    <>
      <div className="w-full flex flex-col gap-32">
        <div className="flex flex-col md:flex-row gap-32 md:gap-64 w-full items-center">
          <div className="grow">
            <ButtonGroup orientation={isMobbile ? "vertical" : "horizontal"}>
              <Button onClick={() => handleSelectView("table")}>
                {te("views.table.title")}
              </Button>
              <Button onClick={() => handleSelectView("structure")}>
                {te("views.structure.title")}
              </Button>
              <Button onClick={() => handleSelectView("stats")}>
                {te("views.stats.title")}
              </Button>
              <Button onClick={() => handleSelectView("chart")}>
                {te("views.chart.title")}
              </Button>
            </ButtonGroup>
          </div>
          <div className="flex flex-row gap-8 flex-wrap skrink">
            <FiltersToogle />
            <Button
              iconOnly={true}
              hasIcon={true}
              leadingIcon="agora-line-file-share"
              leadingIconHover="agora-line-file-share"
              title={te("actions.export")}
              appearance={"outline"}
            />
          </div>
        </div>
        <div className="w-full">
          <Filters />
        </div>
        <div className="w-full flex flex-col gap-16">{view}</div>
      </div>
    </>
  );
}
