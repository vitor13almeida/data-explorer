import { BarChart2 } from "lucide-react";
import LineWrapper from "./LineWrapper";

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
    <LineWrapper>
      <div className="flex items-center justify-between gap-8">
        <span className="flex items-center gap-8 text-m-regular text-neutral-900">
          {Icon && <Icon size={iconSize} />}
          {label}
        </span>
        <span className="text-s-medium text-neutral-700">{value}</span>
      </div>
    </LineWrapper>
  );
}
