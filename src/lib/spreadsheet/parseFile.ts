import * as XLSX from "xlsx";

export interface ParsedFile {
  headers: string[];
  rows: Record<string, unknown>[];
}

function normalizeHeaders(raw: unknown[]): string[] {
  const seen = new Map<string, number>();
  return raw.map((h, i) => {
    let name = (h == null || String(h).trim() === "") ? `Column ${i + 1}` : String(h).trim();
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    if (count > 0) name = `${name} (${count + 1})`;
    return name;
  });
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return { headers: [], rows: [] };
  const ws = wb.Sheets[sheetName];
  const arr = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: null, blankrows: false });
  if (arr.length === 0) return { headers: [], rows: [] };

  const headers = normalizeHeaders(arr[0] as unknown[]);
  const rows: Record<string, unknown>[] = [];
  for (let r = 1; r < arr.length; r++) {
    const row = arr[r] as unknown[];
    if (!row || row.every((v) => v == null || v === "")) continue;
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      let v: unknown = row[i] ?? null;
      if (v instanceof Date) v = v.toISOString();
      obj[h] = v;
    });
    rows.push(obj);
  }
  return { headers, rows };
}
