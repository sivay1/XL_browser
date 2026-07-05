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

export const MOCK_COLUMNS: ColumnMeta[] = analyzeColumns(MOCK_HEADERS, MOCK_ROWS);
