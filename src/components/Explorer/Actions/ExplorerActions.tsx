"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { ViewType } from "@/services/types";
import { exportToCsv } from "@/utils/exportToCsv";
import { exportToJson } from "@/utils/exportToJson";
import { useTranslation } from "react-i18next";
import FiltersToogle from "../Filters/FiltersToogle";
import Button from "@/components/Shared/Button/Button";
import ChartActions from "./ChartActions";
import ButtonGroup from "@/components/Shared/Button/ButtonGroup";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type ExplorerActionsI = {
  selectedView: ViewType;
};

export default function ExplorerActions({ selectedView }: ExplorerActionsI) {
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data } = useResourceContext();

  const isMobile = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  const hasData = !isLoadingData && data && data.data.length > 0;

  const handleClickExportCsv = () => {
    if (hasData) {
      exportToCsv(data.data);
    }
  };

  const handleClickExportJson = () => {
    if (hasData) {
      exportToJson(data.data);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center lg:justify-end w-full lg:w-auto">
      <FiltersToogle />

      <div className="w-full lg:w-auto">
        <ButtonGroup orientation={isMobile ? "vertical" : "horizontal"}>
          <Button
            hasIcon
            leadingIcon="agora-line-document"
            leadingIconHover="agora-line-document"
            title={te("actions.exportCsv")}
            appearance="outline"
            disabled={!hasData}
            onClick={handleClickExportCsv}
          >
            {te("actions.exportCsv")}
          </Button>
          <Button
            hasIcon
            leadingIcon="agora-line-package"
            leadingIconHover="agora-line-package"
            title={te("actions.exportJson")}
            appearance="outline"
            disabled={!hasData}
            onClick={handleClickExportJson}
          >
            {te("actions.exportJson")}
          </Button>
          {selectedView === "chart" ? <ChartActions /> : <></>}
        </ButtonGroup>
      </div>
    </div>
  );
}
