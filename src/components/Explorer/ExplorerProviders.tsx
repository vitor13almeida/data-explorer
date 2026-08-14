"use client";

import { ChartProvider } from "@/providers/ChartProvider";
import { ResourceProvider } from "@/providers/ResourceProvider";
import { DatasetProfileResponse } from "@/services/types";
import { PopupProvider, ToastProvider } from "@ama-pt/agora-design-system";
import { ReactNode } from "react";

export type ExplorerProvidersI = {
  locale: string;
  resourceId: string;
  structure: DatasetProfileResponse;
  children: ReactNode;
};

export default function ExplorerProviders({
  locale,
  resourceId,
  structure,
  children,
}: ExplorerProvidersI) {
  return (
    <ToastProvider position={"bottom-right"}>
      <ResourceProvider
        locale={locale}
        resourceId={resourceId}
        structure={structure}
      >
        <ChartProvider>
          <PopupProvider>{children}</PopupProvider>
        </ChartProvider>
      </ResourceProvider>
    </ToastProvider>
  );
}
