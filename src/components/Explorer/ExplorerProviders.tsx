"use client";

import { ChartProvider } from "@/providers/ChartProvider";
import { ResourceProvider } from "@/providers/ResourceProvider";
import { DatasetProfileResponse } from "@/services/types";
import { ToastProvider } from "@ama-pt/agora-design-system";
import { ReactNode } from "react";

export type ExplorerProvidersI = {
  resourceId: string;
  structure: DatasetProfileResponse;
  children: ReactNode;
};

export default function ExplorerProviders({
  resourceId,
  structure,
  children,
}: ExplorerProvidersI) {
  return (
    <ToastProvider position={"bottom-right"}>
      <ResourceProvider resourceId={resourceId} structure={structure}>
        <ChartProvider>{children}</ChartProvider>
      </ResourceProvider>
    </ToastProvider>
  );
}
