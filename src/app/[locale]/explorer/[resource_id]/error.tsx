"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Button from "@/components/Shared/Button/Button";
import { AlertTriangle } from "react-feather";

export default function ExplorerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const description = error.message || t("errors.generic.description");

  return (
    <div className="flex flex-col items-center justify-center gap-24 py-64 px-16 text-center">
      <div className="flex h-80 w-80 items-center justify-center rounded-full bg-danger-50">
        <AlertTriangle size={40} className="text-danger-600" />
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-xl-semibold text-neutral-900">
          {t("errors.generic.title")}
        </h1>
        <p className="text-m-regular text-neutral-500 max-w-md">
          {description}
        </p>
      </div>

      <div className="flex flex-row gap-8">
        <Button appearance="outline" onClick={() => router.back()}>
          {t("errors.generic.goBack")}
        </Button>
        <Button onClick={() => reset()}>{t("errors.generic.tryAgain")}</Button>
      </div>
    </div>
  );
}
