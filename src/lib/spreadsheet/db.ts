import Dexie, { type Table } from "dexie";
import type { RowRecord, UploadRecord } from "./types";

export class SpreadsheetDB extends Dexie {
  uploads!: Table<UploadRecord, number>;
  rows!: Table<RowRecord, number>;

  constructor() {
    super("spreadsheet_explorer");
    this.version(1).stores({
      uploads: "++id, name, uploadedAt",
      rows: "++id, uploadId",
    });
  }
}

let _db: SpreadsheetDB | null = null;
export function getDB(): SpreadsheetDB {
  if (typeof window === "undefined") {
    throw new Error("SpreadsheetDB is browser-only");
  }
  if (!_db) _db = new SpreadsheetDB();
  return _db;
}
