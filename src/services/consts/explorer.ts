export const PAGE_SIZES = [10, 20, 50];

export const FilterOperatorText = [
  "contains",
  "notcontains",
  "exact",
  "differs",
  "isnull",
  "isnotnull",
] as const;

export const FilterOperatorNumber = [
  ...FilterOperatorText,
  "less", // for numbers only
  "strictly_less",
  "strictly_greater",
  "greater",
] as const;
