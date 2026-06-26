import type { ColumnMeta, ColumnType, FilterKind } from "./types";

const BOOL_TRUE = new Set(["true", "yes", "y", "1"]);
const BOOL_FALSE = new Set(["false", "no", "n", "0"]);

function isNumberLike(v: unknown): boolean {
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n);
  }
  return false;
}

function isDateLike(v: unknown): boolean {
  if (v instanceof Date) return !isNaN(v.getTime());
  if (typeof v === "string" && v.length >= 6) {
    const t = Date.parse(v);
    return !isNaN(t);
  }
  return false;
}

function isBoolLike(v: unknown): boolean {
  if (typeof v === "boolean") return true;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return BOOL_TRUE.has(s) || BOOL_FALSE.has(s);
  }
  return false;
}

export function coerceBool(v: unknown): boolean | null {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (BOOL_TRUE.has(s)) return true;
    if (BOOL_FALSE.has(s)) return false;
  }
  return null;
}

export function coerceNum(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function coerceDate(v: unknown): Date | null {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") {
    const t = Date.parse(v);
    return isNaN(t) ? null : new Date(t);
  }
  return null;
}

export function analyzeColumns(headers: string[], rows: Record<string, unknown>[]): ColumnMeta[] {
  return headers.map((h) => analyzeColumn(h, rows));
}

function analyzeColumn(name: string, rows: Record<string, unknown>[]): ColumnMeta {
  const values = rows.map((r) => r[name]).filter((v) => v != null && v !== "");
  const sample = values.slice(0, 200);
  if (sample.length === 0) {
    return { name, type: "string", filterKind: "text" };
  }

  let nums = 0, dates = 0, bools = 0;
  for (const v of sample) {
    if (isBoolLike(v)) bools++;
    else if (isNumberLike(v)) nums++;
    else if (isDateLike(v)) dates++;
  }
  const n = sample.length;
  let type: ColumnType = "string";
  if (bools / n > 0.8) type = "boolean";
  else if (nums / n > 0.8) type = "number";
  else if (dates / n > 0.8) type = "date";

  let filterKind: FilterKind;
  const meta: ColumnMeta = { name, type, filterKind: "text" };

  if (type === "boolean") {
    filterKind = "boolean";
  } else if (type === "number") {
    filterKind = "range";
    const nv = values.map(coerceNum).filter((x): x is number => x != null);
    if (nv.length) {
      meta.min = Math.min(...nv);
      meta.max = Math.max(...nv);
    }
  } else if (type === "date") {
    filterKind = "dateRange";
    const dv = values.map(coerceDate).filter((x): x is Date => x != null);
    if (dv.length) {
      const ts = dv.map((d) => d.getTime());
      meta.minDate = new Date(Math.min(...ts)).toISOString();
      meta.maxDate = new Date(Math.max(...ts)).toISOString();
    }
  } else {
    // string: facet vs text
    const distinct = new Set(values.map((v) => String(v)));
    if (distinct.size <= 30 && distinct.size < values.length * 0.8) {
      filterKind = "facet";
      meta.facetValues = Array.from(distinct).sort((a, b) => a.localeCompare(b));
    } else {
      filterKind = "text";
    }
  }

  meta.filterKind = filterKind;
  return meta;
}
