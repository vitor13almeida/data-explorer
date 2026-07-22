"use client";

import { ResourceProvider } from "@/providers/ResourceProvider";
import { ToastProvider } from "@ama-pt/agora-design-system";
import { ReactNode } from "react";

export type ExplorerProvidersI = { children: ReactNode };

export default function ExplorerProviders({ children }: ExplorerProvidersI) {
  return (
    <ToastProvider position={"bottom-right"}>
      <ResourceProvider>{children}</ResourceProvider>
    </ToastProvider>
  );
}
