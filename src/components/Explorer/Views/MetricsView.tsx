"use client";

import StatCard, { StatCardI } from "@/components/Shared/Card/StatsCard";
import { useResourceContext } from "@/hooks/useResourceContext";
import {
  ColumnProfile,
  NumericColumnProfile,
  TopValue,
} from "@/services/types";
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Activity,
  Copy,
  Code,
  Layers,
  AlertTriangle,
} from "react-feather";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ICON_SIZE = 20;
const MAX_UNIQUE_VALUES = 10;
const MISSING_THRESHOLD = 0.2;
const SCORE_THRESHOLD = 0.5;
const OUTLIER_THRESHOLD = 3;
const DUPLICATES_THRESHOLD = 0.1;

function isNumeric(profile: ColumnProfile): profile is NumericColumnProfile {
  return "min" in profile;
}

type AlertI = {
  type: "warning" | "danger";
  message: string;
  columns?: string[];
};

function useDataAlerts(
  te: (key: string, options?: Record<string, any>) => string,
) {
  const { structure } = useResourceContext();

  return useMemo(() => {
    const { profile, columns, total_lines, nb_duplicates } = structure.profile;

    const alerts: AlertI[] = [];

    const missingColumns = Object.entries(profile).filter(
      ([, col]) => col.nb_missing_values / total_lines > MISSING_THRESHOLD,
    );

    if (missingColumns.length > 0) {
      alerts.push({
        type: "warning",
        message: te("views.metrics.alerts.missingValues", {
          count: missingColumns.length,
          threshold: Math.round(MISSING_THRESHOLD * 100),
        }),
        columns: missingColumns.map(([name]) => name),
      });
    }

    /*const outlierColumns = Object.entries(profile).filter(([, col]) => {
      if (!isNumeric(col) || col.std === 0) return false;

      const min = Number(col.min);
      const max = Number(col.max);
      const mean = Number(col.mean);
      const std = Number(col.std);

      return (
        Math.abs(min - mean) > OUTLIER_THRESHOLD * std ||
        Math.abs(max - mean) > OUTLIER_THRESHOLD * std
      );
    });

    if (outlierColumns.length > 0) {
      alerts.push({
        type: "warning",
        message: te("views.metrics.alerts.outliers", {
          count: outlierColumns.length,
        }),
        columns: outlierColumns.map(([name]) => name),
      });
    }*/

    const lowScoreColumns = Object.entries(columns).filter(
      ([, col]) => col.score < SCORE_THRESHOLD,
    );

    if (lowScoreColumns.length > 0) {
      alerts.push({
        type: "danger",
        message: te("views.metrics.alerts.lowScore", {
          count: lowScoreColumns.length,
          threshold: Math.round(SCORE_THRESHOLD * 100),
        }),
        columns: lowScoreColumns.map(([name]) => name),
      });
    }

    const duplicatesNum = Number(nb_duplicates) || 0;
    const duplicatesRatio = total_lines > 0 ? duplicatesNum / total_lines : 0;

    if (duplicatesRatio > DUPLICATES_THRESHOLD) {
      alerts.push({
        type: "warning",
        message: te("views.metrics.alerts.duplicates", {
          percentage: Math.round(duplicatesRatio * 100),
        }),
      });
    }

    return alerts;
  }, [structure, te]);
}

function DataAlerts({ alerts }: { alerts: AlertI[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-12">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-8 rounded-lg border p-16 ${
            alert.type === "danger"
              ? "border-danger-200 bg-danger-50"
              : "border-warning-200 bg-warning-50"
          }`}
        >
          <div className="flex items-center gap-8">
            <AlertTriangle
              size={16}
              className={
                alert.type === "danger"
                  ? "text-danger-600 shrink-0"
                  : "text-warning-600 shrink-0"
              }
            />
            <span
              className={`text-m-medium ${
                alert.type === "danger" ? "text-danger-700" : "text-warning-700"
              }`}
            >
              {alert.message}
            </span>
          </div>

          {alert.columns && alert.columns.length > 0 && (
            <div className="flex flex-wrap gap-4 pl-24">
              {alert.columns.map((col) => (
                <span
                  key={col}
                  className={`inline-flex items-center rounded-16 px-8 py-2 text-xs ${
                    alert.type === "danger"
                      ? "bg-danger-100 text-danger-700"
                      : "bg-warning-100 text-warning-700"
                  }`}
                >
                  {col}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type MetricI = {
  label: string;
  value: string | number;
  icon?: typeof BarChart2;
};

function Metric({ label, value, icon: Icon }: MetricI) {
  return (
    <div className="flex items-center justify-between gap-8 py-4">
      <span className="flex items-center gap-8 text-m-regular text-neutral-500">
        {Icon && <Icon size={ICON_SIZE} />}
        {label}
      </span>
      <span className="text-m-medium text-neutral-900">{value}</span>
    </div>
  );
}

type TopsListI = {
  tops: TopValue[];
};

function TopsList({ tops }: TopsListI) {
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

function UniqueValuesList({ values }: { values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {values.map((value, idx) => (
        <span
          key={idx}
          className="inline-flex items-center rounded-16 bg-primary-50 px-8 py-2 text-m-regular text-primary-700 truncate max-w-full"
          title={value}
        >
          {value || "—"}
        </span>
      ))}
    </div>
  );
}

type ColumnCardI = {
  name: string;
  type: string;
  profile: ColumnProfile;
  isCategorical: boolean;
  uniqueValues: string[];
  labels: Record<string, string>;
};

function ColumnCard({
  name,
  type,
  profile,
  isCategorical,
  uniqueValues,
  labels,
}: ColumnCardI) {
  const showUniqueValues =
    isCategorical &&
    uniqueValues.length > 0 &&
    uniqueValues.length <= MAX_UNIQUE_VALUES;

  return (
    <div className="flex flex-col gap-12 rounded-lg border border-neutral-200 bg-white p-16">
      <div className="flex items-center justify-between gap-8">
        <span
          className="text-m-semibold text-neutral-900 truncate"
          title={name}
        >
          {name}
        </span>
        <div className="flex items-center gap-4 shrink-0">
          {isCategorical && (
            <span className="inline-flex items-center rounded-16 bg-warning-100 px-8 py-2 text-m-regular text-warning-700">
              {labels.categorical}
            </span>
          )}
          <span className="inline-flex items-center rounded-16 bg-neutral-100 px-8 py-2 text-m-regular text-neutral-600">
            {type}
          </span>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100">
        <Metric
          label={labels.distinct}
          value={profile.nb_distinct}
          icon={BarChart2}
        />
        <Metric
          label={labels.missing}
          value={profile.nb_missing_values}
          icon={Activity}
        />

        {isNumeric(profile) && (
          <>
            <Metric
              label={labels.min}
              value={profile.min}
              icon={TrendingDown}
            />
            <Metric label={labels.max} value={profile.max} icon={TrendingUp} />
            <Metric
              label={labels.mean}
              value={Number(profile.mean).toFixed(2)}
            />
            <Metric label={labels.std} value={Number(profile.std).toFixed(2)} />
          </>
        )}
      </div>

      {profile.tops.length > 0 && (
        <div className="flex flex-col gap-8">
          <span className="text-m-medium text-neutral-500">
            {labels.topValues}
          </span>
          <TopsList tops={profile.tops} />
        </div>
      )}

      {showUniqueValues && (
        <div className="flex flex-col gap-8">
          <span className="text-m-medium text-neutral-500">
            {labels.uniqueValues}
          </span>
          <UniqueValuesList values={uniqueValues} />
        </div>
      )}
    </div>
  );
}

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
