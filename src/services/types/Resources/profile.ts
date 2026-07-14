import { ColumnDefinition, TopValue } from "./common";

export interface BaseColumnProfile {
  tops: TopValue[];
  nb_distinct: number;
  nb_missing_values: number;
}

export interface NumericColumnProfile extends BaseColumnProfile {
  min: number | string;
  max: number | string;
  mean: number;
  std: number;
}

export type ColumnProfile = BaseColumnProfile | NumericColumnProfile;

export interface DatasetProfile {
  header: string[];

  columns: Record<string, ColumnDefinition>;

  formats: Record<string, string[]>;

  profile: Record<string, ColumnProfile>;

  encoding: string;
  separator: string;

  categorical: string[];

  total_lines: number;
  nb_duplicates: string;

  unique_values: Record<string, string[]>;

  columns_fields: Record<string, ColumnDefinition>;

  columns_labels: Record<string, ColumnDefinition>;

  header_row_idx: number;
  heading_columns: number;
  trailing_columns: number;
}

export interface DatasetProfileResponse {
  profile: DatasetProfile;
  deleted_at: string | null;
  dataset_id: string;
  indexes: unknown | null;
}
