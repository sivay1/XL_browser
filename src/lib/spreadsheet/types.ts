export type ColumnType = "number" | "date" | "boolean" | "string";

export type FilterKind = "facet" | "text" | "range" | "dateRange" | "boolean";

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  filterKind: FilterKind;
  // for facets
  facetValues?: string[];
  // for number ranges
  min?: number;
  max?: number;
  // for date ranges (ISO)
  minDate?: string;
  maxDate?: string;
}

export interface UploadRecord {
  id?: number;
  name: string;
  uploadedAt: number;
  rowCount: number;
  columns: ColumnMeta[];
}

export interface RowRecord {
  id?: number;
  uploadId: number;
  data: Record<string, unknown>;
}
