"use server";

import {
  ApiValidationErrorResponse,
  FilterOperatorType,
  ResourceDataResponse,
  ResourceStructureResponse,
  ResourceStructureResponseValidationError,
} from "@/services/types/Resources";
import { TABULAR_API_URL } from "../../../../../next.config";
import { prepareUrlSearchParams } from "@/utils/urlParams";

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
  resourceId: string,
  page: number = 0,
  page_size: number = 20,
  sortCol: string | null = null,
  sortOrder: string | null = null,
  headers: string[] = [],
  filtersOperator: Record<string, FilterOperatorType> = {},
  filters: Record<string, any>,
): Promise<ResourceDataResponse> {
  try {
    const queryParams = prepareUrlSearchParams(
      page,
      page_size,
      sortCol,
      sortOrder,
      headers,
      filtersOperator,
      filters ?? {},
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
          error: detailMessage || "Erro inesperado da API",
          errors: errorObject.errors,
        };
      }

      return {
        status: response.status,
        error: `API Error: ${response.statusText}`,
        errors: [],
      };
    }

    return { status: 200, data: responseBody } as const;
  } catch (error: any) {
    console.error("Falha no fetch de dados do recurso:", error);

    // Distinguish connection errors from other errors
    const isNetworkError =
      error instanceof TypeError || error.message.includes("fetch");

    return {
      status: 500,
      error: isNetworkError
        ? "Falha de conexão com a API"
        : error.message || "Erro interno no servidor.",
      errors: [],
    };
  }
}

export async function getStructure(
  resourceId: string,
): Promise<ResourceStructureResponse> {
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
          error: detailMessage || "Erro inesperado da API",
          errors: errorObject.errors,
        };
      }

      return {
        status: response.status,
        error: `API Error: ${response.statusText}`,
        errors: [],
      };
    }

    return { status: 200, data: responseBody } as const;
  } catch (error: any) {
    console.error("Falha no fetch de dados do recurso:", error);

    // Distinguish connection errors from other errors
    const isNetworkError =
      error instanceof TypeError || error.message.includes("fetch");

    return {
      status: 500,
      error: isNetworkError
        ? "Falha de conexão com a API"
        : error.message || "Erro interno no servidor.",
      errors: [],
    };
  }
}
