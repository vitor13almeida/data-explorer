"use server";

import {
  ApiValidationErrorResponse,
  ResourceDataResponse,
  ResourceStructureResponse,
  ResourceStructureResponseValidationError,
} from "@/services/types/Resources";
import { TABULAR_API_URL } from "../../../../../next.config";

export async function getData(
  resourceId: string,
  page: number = 0,
  page_size: number = 20,
  sortCol: string | null = null,
  sortOrder: string | null = null,
): Promise<ResourceDataResponse> {
  try {
    let params = {
      page: page.toString(),
      page_size: page_size.toString(),
    };

    if (sortCol) {
      params = { ...params, [`${sortCol}__sort`]: sortOrder };
    }

    const queryParams = new URLSearchParams(params);

    const apiUrl = `http://${TABULAR_API_URL}/api/resources/${resourceId}/data/?${queryParams.toString()}`;

    console.log("---> apiUrl", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Try to parse error response as validation error
      try {
        const errorJson = JSON.parse(errorText) as ApiValidationErrorResponse;
        if (response.status === 400 && errorJson.errors) {
          return {
            status: 400,
            error: "Erro de validação do pedido de recurso",
            rawErrors: errorJson.errors,
          };
        }
      } catch {
        // If not JSON or validation error, continue to generic error
      }

      return {
        status: response.status,
        error: `API Error: ${response.statusText}`,
        rawErrors: [],
      };
    }

    const data = await response.json();

    return { status: 200, data } as const;
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
      rawErrors: [],
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

    if (!response.ok) {
      const errorText = await response.text();

      // Try to parse error response as validation error
      try {
        const errorJson = JSON.parse(
          errorText,
        ) as ResourceStructureResponseValidationError;
        if (response.status === 400 && errorJson.rawErrors) {
          return {
            status: 400,
            error: "Erro de validação do pedido de recurso",
            rawErrors: errorJson.rawErrors,
          };
        }
      } catch {
        // If not JSON or validation error, continue to generic error
      }

      return {
        status: response.status,
        error: `API Error: ${response.statusText}`,
        rawErrors: [],
      };
    }

    const data = await response.json();

    return { status: 200, data } as const;
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
      rawErrors: [],
    };
  }
}
