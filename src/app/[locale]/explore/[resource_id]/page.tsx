import initTranslations from "@/app/i18n";
import ResourcePageContent from "@/components/Resources/ResourcePageContent";
import { ResourceProvider } from "@/providers/ResourceProvider";
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
    namespaces: ["resources"],
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ locale: string; resource_id: string }>;
}) {
  const { locale, resource_id } = await params;
  return (
    <ResourceProvider>
      <ResourcePageContent resourceId={resource_id} />
    </ResourceProvider>
  );
}
