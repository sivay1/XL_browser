import { analyzeColumns } from "./columnAnalysis";
import type { ColumnMeta } from "./types";

export const MOCK_HEADERS = [
  "Name",
  "ID_Number",
  "Course_Name",
  "Start_date",
  "End_date",
  "Status",
];

export const MOCK_ROWS: Record<string, unknown>[] = [
  {
    Name: "Aravindh",
    ID_Number: 123,
    Course_Name: "AI",
    Start_date: "21/02/2026",
    End_date: "22/06/2026",
    Status: "Completed",
  },
  {
    Name: "Nataraj",
    ID_Number: 124,
    Course_Name: "Backend",
    Start_date: "21/03/2026",
    End_date: "22/06/2026",
    Status: "Completed",
  },
  {
    Name: "Vicky",
    ID_Number: 125,
    Course_Name: "Frontend",
    Start_date: "21/01/2026",
    End_date: "22/06/2026",
    Status: "Completed",
  },
  {
    Name: "Mani",
    ID_Number: 126,
    Course_Name: "AI-dev",
    Start_date: "21/01/2026",
    End_date: "22/06/2026",
    Status: "Completed",
  },
  {
    Name: "Kali",
    ID_Number: 127,
    Course_Name: "Systems",
    Start_date: "20/02/2026",
    End_date: "22/07/2026",
    Status: "Completed",
  },
  {
    Name: "Ani",
    ID_Number: 128,
    Course_Name: "OS",
    Start_date: "26/03/2026",
    End_date: "22/05/2026",
    Status: "Completed",
  },
  {
    Name: "Chen",
    ID_Number: 129,
    Course_Name: "Cour",
    Start_date: "21/04/2026",
    End_date: "22/05/2026",
    Status: "Completed",
  },
];

export const MOCK_COLUMNS: ColumnMeta[] = analyzeColumns(MOCK_HEADERS, MOCK_ROWS);
