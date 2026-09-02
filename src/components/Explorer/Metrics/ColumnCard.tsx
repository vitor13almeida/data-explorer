"use client";

import { ColumnProfile, NumericColumnProfile } from "@/services/types";
import Metric from "./Metric";
import TopsList from "./TopsList";
import UniqueValuesList from "./UniqueValuesList";
import Pill from "@/components/Shared/Pill/Pill";
import LineWrapper from "./LineWrapper";

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
    <div className="flex flex-col gap-16 bg-neutral-100 p-16 lg:p-32 border-b-8 border-primary-600">
      <div className="flex flex-wrap items-center gap-16">
        <span className="text-m-semibold text-neutral-900">{name}</span>
        {isCategorical && (
          <Pill variant="primary" appearance="outline">
            {labels.categorical}
          </Pill>
        )}
        <span className="inline-flex items-center rounded-16 bg-neutral-100 px-8 py-2 text-m-regular text-neutral-600 lowercase">
          <Pill variant="neutral" appearance="outline">
            {type}
          </Pill>
        </span>
      </div>

      <div className="flex flex-col gap-16">
        <Metric label={labels.distinct} value={profile.nb_distinct} />
        <Metric label={labels.missing} value={profile.nb_missing_values} />

        {isNumeric(profile) && (
          <>
            <Metric label={labels.min} value={profile.min} />
            <Metric label={labels.max} value={profile.max} />
            <Metric
              label={labels.mean}
              value={Number(profile.mean).toFixed(2)}
            />
            <Metric label={labels.std} value={Number(profile.std).toFixed(2)} />
          </>
        )}
      </div>

      {profile.tops.length > 0 && (
        <LineWrapper>
          <div className="flex flex-col gap-8">
            <span className="text-m-regular text-neutral-900">
              {labels.topValues}
            </span>
            <TopsList tops={profile.tops} />
          </div>
        </LineWrapper>
      )}

      {showUniqueValues && (
        <LineWrapper>
          <div className="flex flex-col gap-8">
            <span className="text-m-regular text-neutral-900">
              {labels.uniqueValues}
            </span>
            <UniqueValuesList values={uniqueValues} />
          </div>
        </LineWrapper>
      )}
    </div>
  );
}
