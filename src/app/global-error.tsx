"use client";

import "@/app/[locale]/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen gap-24 p-16 text-center font-sans">
          <div className="flex h-80 w-80 items-center justify-center rounded-full bg-danger-50 text-4xl">
            ⚠
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold text-neutral-900">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-500 max-w-md">
              An unexpected error occurred. Please try again.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-24 py-10 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
