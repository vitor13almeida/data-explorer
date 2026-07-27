import {
  FilterOperatorBool,
  FilterOperatorCommon,
  FilterOperatorDate,
  FilterOperatorNumber,
  FilterOperatorText,
} from "../consts/explorer";
import { DatasetProfileResponse } from "../types";

export function getDataType(
  header: string,
  structure: DatasetProfileResponse | null,
) {
  return structure?.profile.columns[header].python_type ?? "string";
}

export function getOperatorOptions(dataType: string) {
  switch (dataType) {
    case "string":
      return [...FilterOperatorText];
    case "int":
    case "float":
      return [...FilterOperatorNumber];
    case "date":
      return [...FilterOperatorDate];
    case "bool":
      return [...FilterOperatorBool];
    default:
      return [...FilterOperatorCommon];
  }
}

export function getInitialOperator(
  header: string,
  structure: DatasetProfileResponse | null,
) {
  return (
    getOperatorOptions(getDataType(header, structure))?.at(0) ??
    FilterOperatorCommon[0]
  );
}

export function toBoolean(
  value: boolean | string | null | undefined,
): boolean | null {
  if (value === null || value === undefined || value === "null" || value === "")
    return null;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
}
