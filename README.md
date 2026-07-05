# Spreadsheet Explorer

Spreadsheet Explorer is a client-side web application designed to upload, browse, filter, and search Excel (`.xlsx`, `.xls`) or CSV (`.csv`) files instantly in the browser. It automatically detects columns and generates interactive filters (ranges, date pickers, dropdown facets) tailored to your dataset.

---

## How it Works , Current version:

### 1. File Upload & Parsing

When you drop or select a file in the upload zone:

1. **SheetJS (`xlsx`)** reads the file asynchronously in the browser.
2. **Header Normalization**: The first row is treated as headers. Any empty header cells are named generically (e.g., `Column 1`), and duplicate column headers are automatically versioned (e.g., `Category (2)`) to ensure unique identifiers.
3. **Row Formatting**: It iterates through the dataset rows, mapping cell values to their respective normalized header keys.
4. **Column Analysis**: The application samples up to 200 rows of the uploaded file to infer the data types of each column:
   - **Boolean**: Inferred if $>80\%$ of sample rows contain values like `true`/`false`, `yes`/`no`, `y`/`n`, or `1`/`0`.
   - **Number**: Inferred if $>80\%$ of values are numeric.
   - **Date**: Inferred if $>80\%$ of values parse successfully as a valid date.
   - **Categorical (Facet)**: If the column is a string but has $\le 30$ unique values, it is treated as a categorical dropdown filter.
   - **Text**: Default fallback for standard text searches.

### 2. Client-Side Local Storage (No Backend)

- **Zero Backend Database**: The application does **not** upload or transmit your data to any external server.
- **IndexedDB & Dexie.js**: All parsed file records, meta-information, and raw rows are stored locally in your browser's **IndexedDB** using **Dexie.js** (a lightweight wrapper).
- **Persistence**: Since it utilizes IndexedDB, your uploaded data survives page refreshes and browser restarts, but it remains fully sandboxed in your browser. Clearing your browser data or application storage will clear the uploaded files.

---

## Data Format Guidelines & Date Warnings

For the automatic filters and data grid to render correctly, your spreadsheet columns should have consistent formatting.

### Expected Column Formats

- **Numbers**: Plain numbers without currency symbols or thousands separators (e.g., `1250.50` instead of `$1,250.50`) ensure perfect numeric range filtering.
- **Booleans**: Consistent values like `true`/`false` or `yes`/`no`.
- **Categories**: Columns with repeated values (e.g., Status: `Pending`, `Approved`, `Rejected`) will automatically generate a multi-select dropdown.

### ⚠️ Crucial Date Format Warning

If you upload dates, the browser needs to parse them correctly to set up the date range picker.

- **Excel Formatted Cells**: If the date column in your `.xlsx` or `.xls` file is explicitly formatted as a **Date** type cell in Excel, SheetJS reads it directly as a native JavaScript `Date` object, preserving its accuracy.
- **String-based Dates**: If dates are stored as plain text/strings in the file, the application relies on JavaScript's native `Date.parse()` to recognize and parse them.
- **The `DD-MM-YYYY` Problem**:
  - Native JavaScript `Date.parse()` **does not reliably support** the `DD-MM-YYYY` format (e.g., `25-12-2026`).
  - If you input `31-12-2026`, the browser will fail to parse it, treating it as an invalid date or plain text, meaning date range filters will not be available.
  - If you input `05-12-2026` intending it to be **December 5th**, the browser may parse it as **May 12th** (interpreting it as `MM-DD-YYYY`). This will cause the date displayed on the browser to be **wrong**.

#### Recommended Date Formats

To ensure your dates parse and display correctly:

1. **Format the cells as Dates** in Excel before exporting/saving.
2. Use standard **ISO 8601** format: `YYYY-MM-DD` (e.g., `2026-12-25`).
3. Use standard US format: `MM/DD/YYYY` (e.g., `12/25/2026`).

---

## Local Development

To run the project locally on your machine:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or the URL shown in your terminal) in your browser.
