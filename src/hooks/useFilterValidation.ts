import { z } from "zod";
import { useMemo } from "react";
import {
  DatasetProfileResponse,
  FilterOperatorType,
} from "@/services/types/Resources";
import { TFunction } from "i18next";

function buildFieldSchema(
  columnType: string,
  operator: FilterOperatorType,
  t: TFunction<"explorer", undefined>,
): z.ZodTypeAny {
  if (["isnull", "isnotnull"].includes(operator)) {
    return z.any();
  }

  switch (columnType) {
    case "int":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || /^-?\d+$/.test(val),
          t("errors.validator.int"),
        );

    case "float":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || /^-?\d+([.,]\d+)?$/.test(val),
          t("errors.validator.float"),
        );

    case "date":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
          t("errors.validator.date"),
        );

    case "bool":
      return z
        .string()
        .optional()
        .refine(
          (val) => val == null || val === "" || ["true", "false"].includes(val),
          t("errors.validator.bool"),
        );

    default:
      return z.string().optional();
  }
}

function buildSchema(
  structure: DatasetProfileResponse | null,
  filtersOperator: Record<string, FilterOperatorType>,
  t: TFunction<"explorer", undefined>,
) {
  if (!structure) return z.record(z.string(), z.any());

  const shape: Record<string, z.ZodTypeAny> = {};

  structure.profile.header.forEach((key) => {
    const operator = filtersOperator[key] ?? "contains";
    const columnType =
      structure.profile.columns?.[key]?.python_type ?? "string";
    shape[key] = buildFieldSchema(columnType, operator, t);
  });

  return z.object(shape);
}

export function useFilterValidation(
  filters: Record<string, any>,
  filtersOperator: Record<string, FilterOperatorType>,
  structure: DatasetProfileResponse | null,
  t: TFunction<"explorer", undefined>,
) {
  const schema = useMemo(
    () => buildSchema(structure, filtersOperator, t),
    [structure, filtersOperator],
  );

  const errors = useMemo(() => {
    const result = schema.safeParse(filters);
    if (result.success) return {} as Record<string, string>;

    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    return fieldErrors;
  }, [schema, filters]);

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
}
