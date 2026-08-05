"use server";

import initTranslations from "@/app/i18n";
import {
  ApiValidationErrorResponse,
  FilterOperatorType,
  ResourceDataResponse,
  ResourceStructureResponse,
  ResourceStructureResponseValidationError,
} from "@/services/types";
import { TABULAR_API_URL } from "../../../../../next.config";
import { prepareUrlSearchParams } from "@/utils/urlParams";
import { INITIAL_PAGE, PAGE_SIZES } from "@/services/consts/explorer";

async function getTranslations(locale: string) {
  const { t } = await initTranslations({
    locale,
    namespaces: ["common"],
  });
  return t;
}

async function readResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getData(
  locale: string,
  resourceId: string,
  page: number = INITIAL_PAGE,
  page_size: number = PAGE_SIZES[0],
  sortCol: string | null = null,
  sortOrder: string | null = null,
  headers: string[] = [],
  filtersOperator: Record<string, FilterOperatorType> = {},
  filters: Record<string, any>,
  columns: string[] = [],
): Promise<ResourceDataResponse> {
  const t = await getTranslations(locale);

  try {
    const queryParams = prepareUrlSearchParams(
      page,
      page_size,
      sortCol,
      sortOrder,
      headers,
      filtersOperator,
      filters ?? {},
      columns,
    );

    const apiUrl = `http://${TABULAR_API_URL}/api/resources/${resourceId}/data/?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const responseBody = await readResponseBody(response);

    if (response.status === 404) {
      return {
        status: 404,
        error: t("errors.api.notFound"),
        errors: [],
      };
    }

    if (!response.ok) {
      const errorObject = responseBody as
        ApiValidationErrorResponse | Record<string, unknown> | string | null;

      if (
        typeof errorObject === "object" &&
        errorObject !== null &&
        "errors" in errorObject &&
        Array.isArray(errorObject.errors) &&
        errorObject.errors.length > 0
      ) {
        const firstError = errorObject.errors[0];
        const detailMessage =
          firstError?.detail?.message ||
          firstError?.detail?.hint ||
          firstError?.title;

        return {
          status: response.status,
          error: detailMessage || t("errors.api.unexpected"),
          errors: errorObject.errors,
        };
      }

      return {
        status: response.status,
        error: t("errors.api.requestFailed", { status: response.statusText }),
        errors: [],
      };
    }

    return { status: 200, data: responseBody } as const;
  } catch (error: any) {
    console.error(t("errors.api.fetchDataFailed"), error);

    const isNetworkError =
      error instanceof TypeError || error.message.includes("fetch");

    return {
      status: 500,
      error: isNetworkError
        ? t("errors.api.connectionFailed")
        : error.message || t("errors.api.serverError"),
      errors: [],
    };
  }
}

export async function getStructure(
  locale: string,
  resourceId: string,
): Promise<ResourceStructureResponse> {
  const t = await getTranslations(locale);

  try {
    const apiUrl = `http://${TABULAR_API_URL}/api/resources/${resourceId}/profile/`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const responseBody = await readResponseBody(response);

    if (response.status === 404) {
      return {
        status: 404,
        error: t("errors.api.notFound"),
        errors: [],
      };
    }

    if (!response.ok) {
      const errorObject = responseBody as
        | ResourceStructureResponseValidationError
        | Record<string, unknown>
        | string
        | null;

      if (
        typeof errorObject === "object" &&
        errorObject !== null &&
        "errors" in errorObject &&
        Array.isArray(errorObject.errors) &&
        errorObject.errors.length > 0
      ) {
        const firstError = errorObject.errors[0];
        const detailMessage =
          firstError?.detail?.message ||
          firstError?.detail?.hint ||
          firstError?.title;

        return {
          status: response.status,
          error: detailMessage || t("errors.api.unexpected"),
          errors: errorObject.errors,
        };
      }

      return {
        status: response.status,
        error: t("errors.api.requestFailed", { status: response.statusText }),
        errors: [],
      };
    }

    return { status: 200, data: responseBody } as const;
  } catch (error: any) {
    console.error(t("errors.api.fetchStructureFailed"), error);

    const isNetworkError =
      error instanceof TypeError || error.message.includes("fetch");

    return {
      status: 500,
      error: isNetworkError
        ? t("errors.api.connectionFailed")
        : error.message || t("errors.api.serverError"),
      errors: [],
    };
  }
}
