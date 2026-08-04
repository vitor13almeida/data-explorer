"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Button from "@/components/Shared/Button/Button";
import { Search } from "react-feather";

export default function ResourceNotFound() {
  const { t: te } = useTranslation("common");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-24 py-64 px-16 text-center">
      <div className="flex h-80 w-80 items-center justify-center rounded-full bg-warning-50">
        <Search size={40} className="text-warning-600" />
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-xl-semibold text-neutral-900">
          {te("errors.resourceNotFound.title")}
        </h1>
        <p className="text-m-regular text-neutral-500 max-w-md">
          {te("errors.resourceNotFound.description")}
        </p>
      </div>

      <Button appearance="outline" onClick={() => router.back()}>
        {te("errors.resourceNotFound.goBack")}
      </Button>
    </div>
  );
}
