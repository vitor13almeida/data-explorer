"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import {
  Database,
  Hash,
  FileText,
  Layers,
  Icon as FeatherIcon,
} from "react-feather";
import { useTranslation } from "react-i18next";

type StatCardProps = {
  icon: FeatherIcon;
  label: string;
  value: string;
};

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-12 rounded-lg border border-neutral-200 bg-white p-16">
      <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-primary-50">
        <Icon size={20} className="text-primary-600" />
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

export default function StructureView() {
  const { t: te } = useTranslation("explorer");

  const { resourceId, structure } = useResourceContext();

  const { profile, dataset_id } = structure;
  const columns = Object.entries(profile.columns);
  const stats: StatCardProps[] = [
    {
      icon: Hash,
      label: te("views.structure.totalItems"),
      value: profile.total_lines.toLocaleString("pt-PT"),
    },
    {
      icon: FileText,
      label: te("views.structure.resourceId"),
      value: resourceId,
    },
    {
      icon: Database,
      label: te("views.structure.datasetId"),
      value: dataset_id,
    },
  ];

  return (
    <div className="flex flex-col gap-24">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <div className="flex items-center gap-8 px-16 py-12 border-b border-neutral-200 bg-neutral-50">
          <Layers size={16} className="text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">
            {te("views.structure.fields")} ({columns.length})
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {columns.map(([name, definition]) => (
            <div
              key={name}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 px-16 py-12"
            >
              <span
                className="text-sm font-medium text-neutral-900 sm:w-1/3 truncate"
                title={name}
              >
                {name}
              </span>
              <div className="flex items-center gap-8 sm:w-2/3">
                <span className="inline-flex items-center rounded-16 bg-primary-50 px-8 py-2 text-xs font-medium text-primary-700">
                  {definition.format}
                </span>
                <span className="inline-flex items-center rounded-16 bg-neutral-100 px-8 py-2 text-xs text-neutral-600">
                  {definition.python_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
