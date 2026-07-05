import { useMemo } from "react";
import { Table, Tag, Typography } from "antd";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { coerceBool, coerceDate, coerceNum } from "@/lib/spreadsheet/columnAnalysis";
import type { ColumnMeta } from "@/lib/spreadsheet/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  columns: ColumnMeta[];
  data: Record<string, unknown>[];
  globalFilter: string;
}

function formatCell(v: unknown, type: ColumnMeta["type"]): string {
  if (v == null || v === "") return "";
  if (type === "date") {
    const d = coerceDate(v);
    if (!d) return String(v);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
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

export function DataExplorer({ columns, data, globalFilter }: Props) {
  const filteredData = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return [];
    return data.filter((row) =>
      Object.values(row).some((val) => val != null && String(val).toLowerCase().includes(q)),
    );
  }, [data, globalFilter]);

  const tableColumns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    return columns.map((col) => ({
      id: col.name,
      accessorFn: (row) => row[col.name],
      header: col.name,
      cell: ({ getValue }) => formatCell(getValue(), col.type),
      sortingFn: col.type === "number" ? "alphanumeric" : "auto",
    }));
  }, [columns]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

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
      const meta = columns.find((c) => c.name === col.id);
      return formatCell(record[col.id], meta?.type ?? "string");
    },
  }));

  const sortedRows = table.getSortedRowModel().rows;
  const dataSource = sortedRows.map((r, i) => ({ ...r.original, __key: i }));

  const isMobile = useIsMobile();
  const scrollY = isMobile ? "calc(100vh - 310px)" : "calc(100vh - 270px)";

  return (
    <section style={{ minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <Tag color="blue">
          {filteredData.length.toLocaleString()} / {data.length.toLocaleString()} rows
        </Tag>
        <Typography.Text type="secondary" style={{ marginLeft: "auto" }}>
          Default Spreadsheet Data
        </Typography.Text>
      </div>
      <Table
        size="small"
        rowKey="__key"
        columns={antdColumns}
        dataSource={dataSource}
        locale={{
          emptyText: globalFilter.trim()
            ? "No matching records found"
            : "Enter a search query in the sidebar to display records (e.g., ID Number, Name, Course)",
        }}
        pagination={{ pageSize: 25, showSizeChanger: true, pageSizeOptions: [10, 25, 50, 100] }}
        scroll={{ x: "max-content", y: scrollY }}
        style={{ flex: 1, overflow: "hidden" }}
        sticky
      />
    </section>
  );
}
