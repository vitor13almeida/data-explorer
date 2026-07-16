"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Explorer from "./Explorer";

export type ResourcePageContentProps = {
  resourceId: string;
};

export default function ExplorerPageContent({
  resourceId: resourceIdProp,
}: ResourcePageContentProps) {
  const { t: tr } = useTranslation("explorer");
  const {
    setResourceId,
    isLoadingData,
    data,
    errorData,
    isLoadingStructure,
    structure,
    errorStructure,
  } = useResourceContext();

  useEffect(() => {
    setResourceId(resourceIdProp);
  }, []);

  return (
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-32 text-center w-full">
        <h1 className="text-3xl-bold text-black">{tr("title")}</h1>
        <p className="text-l-regular text-neutral-800">{tr("description")}</p>
      </section>
      <section className="flex flex-col gap-32 w-full">
        <div className="grid grid-cols-2 gap-64">
          <div className="flex flex-col gap-32">
            <h2 className="text-2xl-bold text-black">Data received</h2>
            <div className="h-256 overflow-auto">
              {isLoadingData ? (
                <>Loading...</>
              ) : (
                <pre className="text-s-regular">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
            {errorData && (
              <p className="text-s-regular text-danger-600">{errorData}</p>
            )}
          </div>
          <div className="flex flex-col gap-32">
            <h2 className="text-2xl-bold text-black">Structure received</h2>
            <div className="h-256 overflow-auto">
              {isLoadingStructure ? (
                <>Loading...</>
              ) : (
                <pre className="text-s-regular">
                  {JSON.stringify(structure, null, 2)}
                </pre>
              )}
            </div>
            {errorStructure && (
              <p className="text-s-regular text-danger-600">{errorStructure}</p>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-32 w-full">
        <h2 className="text-2xl-bold text-black">Explorer</h2>
        <Explorer />
      </section>
    </main>
  );
}
