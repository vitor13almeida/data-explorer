export default function Home() {
  return (
    <main className="flex w-full flex-col items-center p-32 gap-64">
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">Data Explorer</h1>
        <p className="text-l-regular text-neutral-800">
          Data Viewer Tool (Next.js + TypeScript + Tailwind + ADS)
        </p>
      </section>
      <section className="flex flex-col gap-4 container">
        <h2 className="text-2xl-bold text-black">Data exploration</h2>
        <p className="text-m-regular text-neutral-800">
          A tool that offers open data explorations to facilitate their
          appropriation and reuse.
        </p>
      </section>
    </main>
  );
}
