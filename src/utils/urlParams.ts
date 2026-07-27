import { FilterOperatorType } from "@/services/types";

export function prepareUrlSearchParams(
  page: number = 0,
  page_size: number = 20,
  sortCol: string | null = null,
  sortOrder: string | null = null,
  headers: string[] = [],
  filtersOperator: Record<string, FilterOperatorType> = {},
  filters: Record<string, any>,
): URLSearchParams {
  let params = {
    page: page.toString(),
    page_size: page_size.toString(),
  };

  if (sortCol) {
    params = { ...params, [`${sortCol}__sort`]: sortOrder };
  }

  if (headers && headers.length > 0) {
    headers.forEach((h) => {
      const operator = filtersOperator[h] ?? "contains";
      let filterParamKey = `${h}__${operator}`;
      let filterParamValue;
      if (isFilterWithoutValue(operator)) {
        filterParamValue = "";
      } else {
        if (filters[h]) {
          filterParamValue = filters[h] ?? "";
        } else {
          return;
        }
      }
      params = {
        ...params,
        [filterParamKey]: filterParamValue,
      };
    });
  }

  const queryParams = new URLSearchParams(params);

  return queryParams;
}

function isFilterWithoutValue(operator: FilterOperatorType) {
  return ["isnull", "isnotnull"].includes(operator);
}
