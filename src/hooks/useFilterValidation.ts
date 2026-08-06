import { z } from "zod";
import { useMemo } from "react";
import { DatasetProfileResponse, FilterOperatorType } from "@/services/types";
import { TFunction } from "i18next";
import { toBoolean } from "@/services/utils/data";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function buildFieldSchema(
  pythonType: string,
  format: string,
  operator: FilterOperatorType,
  t: TFunction<"explorer", undefined>,
): z.ZodTypeAny {
  if (["isnull", "isnotnull"].includes(operator)) {
    return z.any();
  }

  // format-specific validation takes priority
  switch (format) {
    case "year":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || /^\d{4}$/.test(val),
          t("errors.validator.year"),
        )
        .refine((val) => {
          if (!val) return true;
          const n = Number(val);
          return n >= MIN_YEAR && n <= MAX_YEAR;
        }, t("errors.validator.yearRange"));

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
        .union([z.boolean(), z.string(), z.null()])
        .optional()
        .refine(
          (val) =>
            val === null ||
            val === undefined ||
            [true, false, "true", "false", "null", ""].includes(val as any),
          "",
        )
        .transform((val) =>
          toBoolean(val as boolean | string | null | undefined),
        );

    /*case "latlon_wgs":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(val),
          t("errors.validator.latlon"),
        );*/

    case "iso_country_code_alpha2":
      return z
        .string()
        .optional()
        .refine(
          (val) => !val || val.length <= 2,
          t("errors.validator.countryCode"),
        );
  }

  // fallback to python_type
  switch (pythonType) {
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
        .union([z.boolean(), z.string(), z.null()])
        .optional()
        .refine(
          (val) =>
            val === null ||
            val === undefined ||
            [true, false, "true", "false", "null", ""].includes(val as any),
          "",
        )
        .transform((val) =>
          toBoolean(val as boolean | string | null | undefined),
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
    const column = structure.profile.columns?.[key];
    const pythonType = column?.python_type ?? "string";
    const format = column?.format ?? "string";
    shape[key] = buildFieldSchema(pythonType, format, operator, t);
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
