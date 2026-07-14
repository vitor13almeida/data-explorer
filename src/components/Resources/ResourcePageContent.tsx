"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export type ResourcePageContentProps = {
  resourceId: string;
};

export default function ResourcePageContent({
  resourceId: resourceIdProp,
}: ResourcePageContentProps) {
  const { t: tr } = useTranslation("resources");
  const { resourceId, setResourceId, data } = useResourceContext();

  useEffect(() => {
    setResourceId(resourceIdProp);
  }, []);

  return (
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">{tr("title")}</h1>
        <p className="text-l-regular text-neutral-800">{tr("description")}</p>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black">Data received</h2>
        <p>resourceId from context: {resourceId}</p>
        <div className="h-256 overflow-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black"></h2>
        <p>resourceId from context: {resourceId}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </section>
    </main>
  );
}
