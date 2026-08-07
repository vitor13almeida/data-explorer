"use client";

import StatCard, { StatCardI } from "@/components/Shared/Card/StatsCard";
import { useResourceContext } from "@/hooks/useResourceContext";
import { Copy, Code, Layers } from "react-feather";
import { useTranslation } from "react-i18next";
import { DataAlerts, useDataAlerts } from "../Metrics/DataAlerts";
import ColumnCard from "../Metrics/ColumnCard";

export default function MetricsView() {
  const { structure } = useResourceContext();
  const { t: te } = useTranslation("explorer");

  const {
    profile,
    columns,
    categorical,
    unique_values,
    nb_duplicates,
    encoding,
    separator,
  } = structure.profile;
  const columnEntries = Object.entries(profile);
  const categoricalSet = new Set(categorical);

  const alerts = useDataAlerts(te);

  const summaryItems: StatCardI[] = [
    {
      icon: Copy,
      label: te("views.metrics.duplicates"),
      value: nb_duplicates,
    },
    {
      icon: Code,
      label: te("views.metrics.encoding"),
      value: encoding,
    },
    {
      icon: Layers,
      label: te("views.metrics.separator"),
      value:
        separator === "," ? "vírgula" : separator === "\t" ? "tab" : separator,
    },
  ];

  const labels = {
    distinct: te("views.metrics.distinct"),
    missing: te("views.metrics.missing"),
    min: te("views.metrics.min"),
    max: te("views.metrics.max"),
    mean: te("views.metrics.mean"),
    std: te("views.metrics.std"),
    topValues: te("views.metrics.topValues"),
    uniqueValues: te("views.metrics.uniqueValues"),
    categorical: te("views.metrics.categorical"),
  };

  if (columnEntries.length === 0) {
    return (
      <p className="text-m-regular text-neutral-500">
        {te("views.metrics.empty")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-24">
      <DataAlerts alerts={alerts} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        {summaryItems.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
        {columnEntries.map(([name, colProfile]) => (
          <ColumnCard
            key={name}
            name={name}
            type={columns[name]?.python_type ?? "—"}
            profile={colProfile}
            isCategorical={categoricalSet.has(name)}
            uniqueValues={unique_values[name] ?? []}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}
