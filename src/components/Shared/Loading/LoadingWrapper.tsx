"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { ReactNode } from "react";
import { Loader } from "react-feather";
import { useTranslation } from "react-i18next";

const ICON_SIZE = 64;

export type LoadingWrapperI = {
  children: ReactNode;
};

export default function LoadingWrapper({ children }: LoadingWrapperI) {
  const { t } = useTranslation("common");

  const { isLoadingData } = useResourceContext();

  return (
    <div className="relative">
      {children}

      {isLoadingData && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-12 rounded-lg bg-primary-100/50">
          <Loader size={ICON_SIZE} className="animate-spin text-primary-600" />
          <span className="text-l-medium text-neutral-700">{t("loading")}</span>
        </div>
      )}
    </div>
  );
}
