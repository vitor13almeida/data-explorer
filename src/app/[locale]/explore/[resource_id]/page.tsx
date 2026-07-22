import initTranslations from "@/app/i18n";
import ExplorerPageContent from "@/components/Explorer/ExplorerPageContent";
import ExplorerProviders from "@/components/Explorer/ExplorerProviders";
import { Metadata } from "next";

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
  return (
    <ExplorerProviders>
      <ExplorerPageContent resourceId={resource_id} />
    </ExplorerProviders>
  );
}
