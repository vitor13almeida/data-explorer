import { VIEW_TYPES } from "../consts/explorer";

export type ViewType = (typeof VIEW_TYPES)[number];

export interface TopValue {
  count: number;
  value: string;
}

export interface ColumnDefinition {
  score: number;
  format: string;
  python_type: string;
}

export interface ApiLinks {
  profile: string;
  swagger: string;
  next: string | null;
  prev: string | null;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
}
