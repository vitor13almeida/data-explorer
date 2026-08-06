import { TopValue } from "@/services/types";

export type TopsListI = {
  tops: TopValue[];
};

export default function TopsList({ tops }: TopsListI) {
  if (tops.length === 0) return null;

  const maxCount = tops[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-4">
      {tops.slice(0, 5).map((top, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className="text-m-regular text-neutral-700 truncate max-w-[70%]"
              title={top.value}
            >
              {top.value || "—"}
            </span>
            <span className="text-m-regular text-neutral-400">{top.count}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-neutral-100">
            <div
              className="h-1 rounded-full bg-primary-400 transition-all duration-300"
              style={{ width: `${(top.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
