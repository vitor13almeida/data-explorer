import { INITIAL_PAGE, PAGE_SIZES } from "@/services/consts/explorer";
import { VIEW_URL_PARAM } from "@/services/consts/urlParams";
import { FilterOperatorType, ViewType } from "@/services/types";

export function prepareUrlSearchParams(
  page: number = INITIAL_PAGE,
  page_size: number = PAGE_SIZES[0],
  sortCol: string | null = null,
  sortOrder: string | null = null,
  headers: string[] = [],
  filtersOperator: Record<string, FilterOperatorType> = {},
  filters: Record<string, any>,
  columns: string[] = [],
  view: ViewType | null = null,
  extraParams: Record<string, string> = {},
): URLSearchParams {
  let params: Record<string, any> = {
    page: page.toString(),
    page_size: page_size.toString(),
  };

  if (view) {
    params = { ...params, [VIEW_URL_PARAM]: view };
  }

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

  if (columns.length > 0) {
    params = { ...params, columns: columns.join(",") };
  }

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params = { ...params, [key]: value };
    }
  });

  const queryParams = new URLSearchParams(params);

  return queryParams;
}

function isFilterWithoutValue(operator: FilterOperatorType) {
  return ["isnull", "isnotnull"].includes(operator);
}
