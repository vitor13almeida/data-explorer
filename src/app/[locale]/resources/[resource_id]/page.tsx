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

  return {
    title: "Resource Page",
    description: "Explore all data, in different formats and views.",
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
