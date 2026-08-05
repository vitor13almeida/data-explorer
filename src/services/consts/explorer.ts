export const INITIAL_PAGE = 1;

export const PAGE_SIZES = [10, 50, 200];

export const FilterOperatorCommon = [
  "exact",
  "differs",
  "isnull",
  "isnotnull",
] as const;

export const FilterOperatorText = [
  "contains",
  "notcontains",
  ...FilterOperatorCommon,
] as const;

export const FilterOperatorNumber = [
  ...FilterOperatorCommon,
  "less",
  "strictly_less",
  "strictly_greater",
  "greater",
] as const;

export const FilterOperatorDate = [
  ...FilterOperatorCommon,
  "less",
  "strictly_less",
  "strictly_greater",
  "greater",
] as const;

export const FilterOperatorBool = [...FilterOperatorCommon] as const;

export const FilterOperatorAll = [
  ...new Set([
    ...FilterOperatorText,
    ...FilterOperatorNumber,
    ...FilterOperatorDate,
    ...FilterOperatorBool,
  ]),
] as const;
