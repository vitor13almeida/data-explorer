"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";
import Explorer from "./Explorer";
import { Hero } from "../Shared/Hero";
import { usePathname } from "next/navigation";

const DEBUG_JSONS = false;

export default function ExplorerPageContent() {
  const path = usePathname();
  const { t: te } = useTranslation("explorer");
  const { isLoadingData, data, errorData, structure } = useResourceContext();

  return (
    <main className="flex w-full flex-col items-center gap-64 pb-96">
      <Hero.Root>
        <Hero.Breadcrumb path={path} limit={2} />
        <Hero.Content>
          <Hero.Title>{te("title")}</Hero.Title>
          <Hero.Description description={te("description")} />
        </Hero.Content>
      </Hero.Root>

      <section className="flex flex-col gap-32 w-full container">
        <Explorer />
      </section>

      {DEBUG_JSONS && (
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
                <pre className="text-s-regular">
                  {JSON.stringify(structure, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
