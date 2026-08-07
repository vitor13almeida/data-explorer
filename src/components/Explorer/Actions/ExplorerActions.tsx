"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { ViewType } from "@/services/types";
import { exportToCsv } from "@/utils/exportToCsv";
import { exportToJson } from "@/utils/exportToJson";
import { useTranslation } from "react-i18next";
import FiltersToogle from "../Filters/FiltersToogle";
import Button from "@/components/Shared/Button/Button";
import ChartActions from "./ChartActions";

export type ExplorerActionsI = {
  selectedView: ViewType;
};

export default function ExplorerActions({ selectedView }: ExplorerActionsI) {
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data } = useResourceContext();

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
      <Button
        iconOnly
        hasIcon
        leadingIcon="agora-line-package"
        leadingIconHover="agora-line-package"
        title={te("actions.exportJson")}
        appearance="outline"
        disabled={!hasData}
        onClick={handleClickExportJson}
      />
      {selectedView === "chart" && <ChartActions />}
    </div>
  );
}
