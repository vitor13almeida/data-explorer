"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Button from "@/components/Shared/Button/Button";
import { Search } from "react-feather";

export default function NotFound() {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-24 py-64 px-16 text-center">
      <div className="flex h-80 w-80 items-center justify-center rounded-full bg-warning-50">
        <Search size={40} className="text-warning-600" />
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-xl-semibold text-neutral-900">404</h1>
        <p className="text-m-regular text-neutral-500 max-w-md">
          {t("errors.notFound.description")}
        </p>
      </div>

      <div className="flex flex-row gap-8">
        <Button appearance="outline" onClick={() => router.back()}>
          {t("errors.notFound.goBack")}
        </Button>
        <Button onClick={() => router.push("/")}>
          {t("errors.notFound.goHome")}
        </Button>
      </div>
    </div>
  );
}
