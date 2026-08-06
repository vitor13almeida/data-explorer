"use client";

import { useResourceContext } from "@/hooks/useResourceContext";
import { useMemo } from "react";
import { AlertTriangle } from "react-feather";

const MISSING_THRESHOLD = 0.2;
const SCORE_THRESHOLD = 0.5;
const OUTLIER_THRESHOLD = 3;
const DUPLICATES_THRESHOLD = 0.1;

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
