import { BarChart2 } from "react-feather";

export type MetricI = {
  label: string;
  value: string | number;
  icon?: typeof BarChart2;
  iconSize?: number;
};

export default function Metric({
  label,
  value,
  icon: Icon,
  iconSize = 20,
}: MetricI) {
  return (
    <div className="flex items-center justify-between gap-8 py-4">
      <span className="flex items-center gap-8 text-m-regular text-neutral-500">
        {Icon && <Icon size={iconSize} />}
        {label}
      </span>
      <span className="text-m-medium text-neutral-900">{value}</span>
    </div>
  );
}
