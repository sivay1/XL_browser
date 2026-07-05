import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const SPREADSHEET_DIR = path.resolve("src/lib/spreadsheet");
const OUTPUT_FILE = path.join(SPREADSHEET_DIR, "mockData.ts");

const DEFAULT_HEADERS = ["Name", "ID_Number", "Course_Name", "Start_date", "End_date", "Status"];
const DEFAULT_ROWS = [
  {
    Name: "Aravindh",
    ID_Number: 123,
    Course_Name: "AI",
    Start_date: "21/02/2026",
    End_date: "22/06/2026",
    Status: "COMPLETED",
  },
  {
    Name: "Nataraj",
    ID_Number: 124,
    Course_Name: "Backend",
    Start_date: "21/03/2026",
    End_date: "22/06/2026",
    Status: "IN-PROGRESS",
  },
  {
    Name: "Vicky",
    ID_Number: 125,
    Course_Name: "Frontend",
    Start_date: "21/01/2026",
    End_date: "22/06/2026",
    Status: "IN-PROGRESS",
  },
  {
    Name: "Mani",
    ID_Number: 126,
    Course_Name: "AI-dev",
    Start_date: "21/01/2026",
    End_date: "22/06/2026",
    Status: "COMPLETED",
  },
  {
    Name: "Rahul",
    ID_Number: 127,
    Course_Name: "Data Science",
    Start_date: "01/04/2026",
    End_date: "01/08/2026",
    Status: "IN-PROGRESS",
  },
  {
    Name: "Sneha",
    ID_Number: 128,
    Course_Name: "Frontend",
    Start_date: "15/02/2026",
    End_date: "15/06/2026",
    Status: "COMPLETED",
  },
  {
    Name: "Vijay",
    ID_Number: 129,
    Course_Name: "DevOps",
    Start_date: "10/03/2026",
    End_date: "10/07/2026",
    Status: "COMPLETED",
  },
  {
    Name: "Priya",
    ID_Number: 130,
    Course_Name: "UI/UX",
    Start_date: "05/01/2026",
    End_date: "05/05/2026",
    Status: "IN-PROGRESS",
  },
  {
    Name: "Karthik",
    ID_Number: 131,
    Course_Name: "Backend",
    Start_date: "12/04/2026",
    End_date: "12/08/2026",
    Status: "IN-PROGRESS",
  },
];

function writeMockDataFile(headers, rows) {
  const content = `import { analyzeColumns } from "./columnAnalysis";
import type { ColumnMeta } from "./types";

export const MOCK_HEADERS = ${JSON.stringify(headers, null, 2)};

export const MOCK_ROWS: Record<string, unknown>[] = ${JSON.stringify(rows, null, 2)};

export const MOCK_COLUMNS: ColumnMeta[] = analyzeColumns(MOCK_HEADERS, MOCK_ROWS);
`;
  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
}

function loadLocalSpreadsheet() {
  try {
    if (!fs.existsSync(SPREADSHEET_DIR)) {
      fs.mkdirSync(SPREADSHEET_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SPREADSHEET_DIR);
    const spreadsheetFile = files.find((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".csv" || ext === ".xlsx" || ext === ".xls";
    });

    if (spreadsheetFile) {
      const filePath = path.join(SPREADSHEET_DIR, spreadsheetFile);
      console.log(`[loadSpreadsheet] Found spreadsheet file: ${spreadsheetFile}. Parsing...`);

      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        console.warn(
          `[loadSpreadsheet] Spreadsheet file ${spreadsheetFile} has no sheets. Falling back to default data.`,
        );
        writeMockDataFile(DEFAULT_HEADERS, DEFAULT_ROWS);
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: true,
        defval: null,
        blankrows: false,
      });

      if (sheetData.length === 0) {
        console.warn(
          `[loadSpreadsheet] Spreadsheet file ${spreadsheetFile} has no rows. Falling back to default data.`,
        );
        writeMockDataFile(DEFAULT_HEADERS, DEFAULT_ROWS);
        return;
      }

      // Normalize headers
      const rawHeaders = sheetData[0] || [];
      const seen = new Map();
      const headers = rawHeaders.map((h, i) => {
        let name = h == null || String(h).trim() === "" ? `Column ${i + 1}` : String(h).trim();
        const count = seen.get(name) ?? 0;
        seen.set(name, count + 1);
        if (count > 0) name = `${name} (${count + 1})`;
        return name;
      });

      // Parse data rows
      const rows = [];
      for (let r = 1; r < sheetData.length; r++) {
        const row = sheetData[r];
        if (!row || row.every((v) => v == null || v === "")) continue;
        const obj = {};
        headers.forEach((h, i) => {
          let v = row[i] ?? null;
          if (v instanceof Date) {
            const dd = String(v.getDate()).padStart(2, "0");
            const mm = String(v.getMonth() + 1).padStart(2, "0");
            const yyyy = v.getFullYear();
            v = `${dd}/${mm}/${yyyy}`;
          }
          obj[h] = v;
        });
        rows.push(obj);
      }

      writeMockDataFile(headers, rows);
      console.log(
        `[loadSpreadsheet] Successfully compiled ${rows.length} rows from ${spreadsheetFile}.`,
      );
    } else {
      console.log(
        "[loadSpreadsheet] No custom spreadsheet (.csv/.xlsx/.xls) found in src/lib/spreadsheet. Generating mockData.ts with default student records.",
      );
      writeMockDataFile(DEFAULT_HEADERS, DEFAULT_ROWS);
    }
  } catch (error) {
    console.error(
      "[loadSpreadsheet] Error during spreadsheet compilation. Falling back to default mock data.",
      error,
    );
    writeMockDataFile(DEFAULT_HEADERS, DEFAULT_ROWS);
  }
}

loadLocalSpreadsheet();
