import initTranslations from "@/app/i18n";
import ExplorerPageContent from "@/components/Explorer/ExplorerPageContent";
import ExplorerProviders from "@/components/Explorer/ExplorerProviders";
import {
  ResourceStructureResponse,
} from "@/services/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStructure } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations({
    locale,
    namespaces: ["explorer"],
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ExplorerPage({
  params,
}: {
  params: Promise<{ locale: string; resource_id: string }>;
}) {
  const { locale, resource_id } = await params;

  if (!resource_id.trim()) notFound();

  const response: ResourceStructureResponse = await getStructure(
    locale,
    resource_id,
  );

  if (response.status === 404) {
    notFound();
  }

  if (response.status !== 200 || !response.data) {
    throw new Error(response.error || "Failed to load structure");
  }

  return (
    <ExplorerProviders
      locale={locale}
      resourceId={resource_id}
      structure={response.data}
    >
      <ExplorerPageContent />
    </ExplorerProviders>
  );
}
