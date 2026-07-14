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

interface ApiDatabaseErrorDetail {
  code: string;
  details: string | null;
  hint: string | null;
  message: string;
}

interface ApiDatabaseErrorItem {
  code: string | null;
  title: string;
  detail: ApiDatabaseErrorDetail;
}

export interface ApiValidationErrorResponse {
  errors: ApiDatabaseErrorItem[];
}

interface ResourceDataResponseOk {
  status: 200;
  data: PaginatedDataResponse;
  error?: never;
  rawErrors?: never;
}

interface ResourceDataResponseValidationError {
  status: 400 | 500;
  data?: never;
  error: string;
  rawErrors: ApiDatabaseErrorItem[];
}

interface ResourceDataResponseNotFound {
  status: 404;
  data?: never;
  error: string;
  rawErrors?: never;
}

interface ResourceDataResponseGenericError {
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
