export default function Home() {
  return (
    <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between p-32 bg-white dark:bg-black sm:items-start">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl-bold text-black">Data Explorer</h1>
        <p className="text-l-regular text-neutral-800">
          Data Viewer Tool (Next.js + TypeScript + Tailwind + ADS)
        </p>
      </div>
    </main>
  );
}
