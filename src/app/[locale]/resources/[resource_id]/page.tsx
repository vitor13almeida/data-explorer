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
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">Resource Page</h1>
        <p className="text-l-regular text-neutral-800">{resource_id}</p>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black">Explorer</h2>
      </section>
    </main>
  );
}
