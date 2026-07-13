"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { useEffect } from "react";

export type ResourcePageContentProps = {
  resourceId: string;
};

export default function ResourcePageContent({
  resourceId: resourceIdProp,
}: ResourcePageContentProps) {
  const { resourceId, setResourceId } = useResourceContext();

  useEffect(() => {
    setResourceId(resourceIdProp);
  }, []);

  return (
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">Resource Page</h1>
        <p className="text-l-regular text-neutral-800">{resourceIdProp}</p>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black">Explorer</h2>
        <p>resourceId from context: {resourceId}</p>
      </section>
    </main>
  );
}
