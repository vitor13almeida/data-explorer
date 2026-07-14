import { ApiLinks, PaginationMeta } from "./common";

export interface DataRow {
  __id: number;
  [key: string]: string | number | boolean | null;
}

export interface PaginatedDataResponse<T extends DataRow = DataRow> {
  data: T[];
  links: ApiLinks;
  meta: PaginationMeta;
}

export interface ApiDatabaseErrorDetail {
  code: string;
  details: string | null;
  hint: string | null;
  message: string;
}

export interface ApiDatabaseErrorItem {
  code: string | null;
  title: string;
  detail: ApiDatabaseErrorDetail;
}

export interface ApiValidationErrorResponse {
  errors: ApiDatabaseErrorItem[];
}

export interface ResourceDataResponseOk {
  status: 200;
  data: PaginatedDataResponse;
  error?: never;
  rawErrors?: never;
}

export interface ResourceDataResponseValidationError {
  status: 400 | 500;
  data?: never;
  error: string;
  rawErrors: ApiDatabaseErrorItem[];
}

export interface ResourceDataResponseNotFound {
  status: 404;
  data?: never;
  error: string;
  rawErrors?: never;
}

export interface ResourceDataResponseGenericError {
  status: Exclude<number, 200 | 400 | 404 | 500> | (number & {});
  data?: never;
  error: string;
  rawErrors?: ApiDatabaseErrorItem[];
}

export type ResourceDataResponse =
  | ResourceDataResponseOk
  | ResourceDataResponseValidationError
  | ResourceDataResponseNotFound
  | ResourceDataResponseGenericError;
