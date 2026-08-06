"use client";

import { ColumnProfile, NumericColumnProfile } from "@/services/types";
import { BarChart2, TrendingUp, TrendingDown, Activity } from "react-feather";
import Metric from "./Metric";
import TopsList from "./TopsList";
import UniqueValuesList from "./UniqueValuesList";

const ICON_SIZE = 20;
const MAX_UNIQUE_VALUES = 10;

function isNumeric(profile: ColumnProfile): profile is NumericColumnProfile {
  return "min" in profile;
}

export type ColumnCardI = {
  name: string;
  type: string;
  profile: ColumnProfile;
  isCategorical: boolean;
  uniqueValues: string[];
  labels: Record<string, string>;
};

export default function ColumnCard({
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
          iconSize={ICON_SIZE}
        />
        <Metric
          label={labels.missing}
          value={profile.nb_missing_values}
          icon={Activity}
          iconSize={ICON_SIZE}
        />

        {isNumeric(profile) && (
          <>
            <Metric
              label={labels.min}
              value={profile.min}
              icon={TrendingDown}
              iconSize={ICON_SIZE}
            />
            <Metric
              label={labels.max}
              value={profile.max}
              icon={TrendingUp}
              iconSize={ICON_SIZE}
            />
            <Metric
              label={labels.mean}
              value={Number(profile.mean).toFixed(2)}
              icon={BarChart2}
              iconSize={ICON_SIZE}
            />
            <Metric
              label={labels.std}
              value={Number(profile.std).toFixed(2)}
              icon={BarChart2}
              iconSize={ICON_SIZE}
            />
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
