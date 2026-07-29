import { Icon as FeatherIcon } from "react-feather";

const ICON_SIZE = 20;

export type StatCardI = {
  icon: FeatherIcon;
  label: string;
  value: string;
};

export default function StatCard({ icon: Icon, label, value }: StatCardI) {
  return (
    <div className="flex items-center gap-12 rounded-lg border border-neutral-200 bg-white p-16">
      <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-primary-100">
        <Icon size={ICON_SIZE} className="text-primary-600" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-neutral-500">{label}</span>
        <span
          className="text-sm font-medium text-neutral-900 truncate"
          title={value}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
