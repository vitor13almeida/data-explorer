"use client";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">{t("title")}</h1>
        <p className="text-l-regular text-neutral-800">{t("description")}</p>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black">{t("title")}</h2>
        <p className="text-m-regular text-neutral-800">{t("description")}</p>
      </section>
    </main>
  );
}
