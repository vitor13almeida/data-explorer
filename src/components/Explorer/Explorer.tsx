"use client";

import { useTranslation } from "react-i18next";
import TableView from "./Views/TableView";
import Button from "../Shared/Button/Button";
import ButtonGroup from "../Shared/Button/ButtonGroup";
import { useMemo, useState } from "react";

type ViewType = "table" | "structure" | "stats" | "chart";

export default function Explorer() {
  const { t: te } = useTranslation("explorer");

  const [selectedView, setSelectedView] = useState<ViewType>("table");

  const handleSelectView = (view: ViewType) => {
    setSelectedView(view);
  };

  const view = useMemo(() => {
    switch (selectedView) {
      case "table":
        return <TableView />;
      case "structure":
        return <>{te("views.structure.title")}...</>;
      case "stats":
        return <>{te("views.stats.title")}...</>;
      case "chart":
        return <>{te("views.chart.title")}...</>;
      default:
        return null;
    }
  }, [selectedView]);

  return (
    <>
      <div className="w-full flex flex-col gap-32">
        <div className="flex flex-row gap-64 w-full items-center">
          <div className="grow">
            <ButtonGroup>
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
            <Button
              iconOnly={true}
              hasIcon={true}
              leadingIcon="agora-line-filter"
              leadingIconHover="agora-line-filter"
              title={te("actions.filter")}
            />
            <Button
              iconOnly={true}
              hasIcon={true}
              leadingIcon="agora-line-file-share"
              leadingIconHover="agora-line-file-share"
              title={te("actions.export")}
            />
          </div>
        </div>
        <div className="w-full">{view}</div>
      </div>
    </>
  );
}
