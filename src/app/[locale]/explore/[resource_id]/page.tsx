import initTranslations from "@/app/i18n";
import ExplorerPageContent from "@/components/Explorer/ExplorerPageContent";
import ExplorerProviders from "@/components/Explorer/ExplorerProviders";
import {
  DatasetProfileResponse,
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

  const { t: te } = await initTranslations({
    locale,
    namespaces: ["explorer"],
  });

  if (!resource_id.trim()) notFound();

  let structure: DatasetProfileResponse | null = null;

  try {
    const response: ResourceStructureResponse = await getStructure(resource_id);
    if (response.status === 200 && response.data) {
      structure = response.data;
    } else {
      throw new Error(
        response.errors?.map((error) => error.detail.hint).join(" ") ||
          te("errors.structure.badRequest"),
      );
    }
  } catch (err) {
    throw new Error(te("errors.structure.failed"));
  }

  return (
    <ExplorerProviders resourceId={resource_id} structure={structure}>
      <ExplorerPageContent/>
    </ExplorerProviders>
  );
}
