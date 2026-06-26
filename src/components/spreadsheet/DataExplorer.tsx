import { useMemo, useState } from "react";
import { Table, Input, Empty, Tag, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { getDB } from "@/lib/spreadsheet/db";
import { coerceBool, coerceDate, coerceNum } from "@/lib/spreadsheet/columnAnalysis";
import type { ColumnMeta } from "@/lib/spreadsheet/types";
import { FilterPanel, type FilterState } from "./FilterPanel";

interface Props {
  uploadId: number;
}

const columnFilterFn: FilterFn<Record<string, unknown>> = (row, columnId, filterValue) => {
  const f = filterValue as FilterState[string];
  if (!f) return true;
  const cell = row.original[columnId];
  if (f.kind === "facet") {
    if (cell == null) return false;
    return f.values.includes(String(cell));
  }
  if (f.kind === "text") {
    if (cell == null) return false;
    return String(cell).toLowerCase().includes(f.value.toLowerCase());
  }
  if (f.kind === "range") {
    const n = coerceNum(cell);
    if (n == null) return false;
    return n >= f.min && n <= f.max;
  }
  if (f.kind === "dateRange") {
    const d = coerceDate(cell);
    if (!d) return false;
    if (f.from && d < new Date(f.from)) return false;
    if (f.to && d > new Date(f.to)) return false;
    return true;
  }
  if (f.kind === "boolean") {
    const b = coerceBool(cell);
    if (b == null) return false;
    return String(b) === f.value;
  }
  return true;
};

const globalFilterFn: FilterFn<Record<string, unknown>> = (row, _id, query) => {
  if (!query) return true;
  const q = String(query).toLowerCase();
  for (const v of Object.values(row.original)) {
    if (v == null) continue;
    if (String(v).toLowerCase().includes(q)) return true;
  }
  return false;
};

function formatCell(v: unknown, type: ColumnMeta["type"]): string {
  if (v == null || v === "") return "";
  if (type === "date") {
    const d = coerceDate(v);
    return d ? d.toLocaleDateString() : String(v);
  }
  if (type === "boolean") {
    const b = coerceBool(v);
    return b == null ? String(v) : b ? "Yes" : "No";
  }
  if (type === "number") {
    const n = coerceNum(v);
    return n == null ? String(v) : n.toLocaleString();
  }
  return String(v);
}

export function DataExplorer({ uploadId }: Props) {
  const upload = useLiveQuery(() => getDB().uploads.get(uploadId), [uploadId]);
  const rows = useLiveQuery(
    () => getDB().rows.where("uploadId").equals(uploadId).toArray(),
    [uploadId],
  );

  const [filters, setFilters] = useState<FilterState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useMemo(() => (rows ?? []).map((r) => r.data), [rows]);

  const tableColumns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!upload) return [];
    return upload.columns.map((col) => ({
      id: col.name,
      accessorFn: (row) => row[col.name],
      header: col.name,
      cell: ({ getValue }) => formatCell(getValue(), col.type),
      filterFn: columnFilterFn,
      sortingFn: col.type === "number" ? "alphanumeric" : "auto",
    }));
  }, [upload]);

  const columnFilters = useMemo(
    () => Object.entries(filters).map(([id, value]) => ({ id, value })),
    [filters],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  if (!upload || !rows) {
    return <Empty description="Loading…" />;
  }

  const filteredCount = table.getFilteredRowModel().rows.length;

  const antdColumns = table.getVisibleLeafColumns().map((col) => ({
    title: (
      <span
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={col.getToggleSortingHandler()}
      >
        {col.columnDef.header as string}
        {col.getIsSorted() === "asc" ? " ▲" : col.getIsSorted() === "desc" ? " ▼" : ""}
      </span>
    ),
    dataIndex: col.id,
    key: col.id,
    ellipsis: true,
    render: (_: unknown, record: Record<string, unknown>) => {
      const meta = upload.columns.find((c) => c.name === col.id);
      return formatCell(record[col.id], meta?.type ?? "string");
    },
  }));

  const sortedRows = table.getSortedRowModel().rows;
  const dataSource = sortedRows.map((r, i) => ({ ...r.original, __key: i }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, height: "100%" }}>
      <aside
        style={{
          background: "var(--ant-color-bg-container, #fff)",
          border: "1px solid var(--ant-color-border, #f0f0f0)",
          borderRadius: 12,
          padding: 12,
          overflow: "auto",
          maxHeight: "calc(100vh - 220px)",
        }}
      >
        <FilterPanel columns={upload.columns} value={filters} onChange={setFilters} />
      </aside>
      <section style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search across all columns…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ maxWidth: 420 }}
          />
          <Tag color="blue">
            {filteredCount.toLocaleString()} / {upload.rowCount.toLocaleString()} rows
          </Tag>
          <Typography.Text type="secondary" style={{ marginLeft: "auto" }}>
            {upload.name}
          </Typography.Text>
        </div>
        <Table
          size="small"
          rowKey="__key"
          columns={antdColumns}
          dataSource={dataSource}
          pagination={{ pageSize: 25, showSizeChanger: true, pageSizeOptions: [10, 25, 50, 100] }}
          scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
          sticky
        />
      </section>
    </div>
  );
}
