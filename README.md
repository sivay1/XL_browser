# Spreadsheet Explorer 🚀

Spreadsheet Explorer is a simple, modern web application that allows you to explore and search any Excel (`.xlsx`, `.xls`) or CSV (`.csv`) file instantly in your web browser.

This guide is designed for **beginners and non-technical users**. Follow the step-by-step instructions below to install and run the application on your computer.

---

## 🛠️ Step 1: Install Node.js (One-Time Setup)

Before running the application, you need to install **Node.js** (a software platform that allows Javascript applications to run on your computer).

1. Go to the official download page: **[nodejs.org](https://nodejs.org)**.
2. Download the **LTS (Long Term Support)** version recommended for most users.
3. Double-click the downloaded file and follow the standard installation wizard instructions (you can click "Next" on all default options).
4. Once installation is complete, verify that it succeeded:
   - On **Windows**: Press `Win + R`, type `cmd`, and press Enter.
   - On **Mac**: Open your **Terminal** app.
   - In the window that appears, type the following command and press Enter:
     ```bash
     node -v
     ```
   - If a version number (like `v24.x.x` or `v22.x.x`) is displayed, Node.js is successfully installed!

---

## 📂 Step 2: Add Your Spreadsheet File

Instead of uploading files through a browser button, this application reads your spreadsheet file directly from the project folder.

1. Open your project folder on your computer.
2. Navigate to the following directory:
   [src/lib/spreadsheet/](file:///c:/Users/HP/Downloads/spread-magic-17-main/spread-magic-17-main/src/lib/spreadsheet)
3. Copy and paste your `.csv`, `.xlsx`, or `.xls` spreadsheet file inside this folder.
   - _Example: You can paste a file named `students.xlsx` or `courses.csv`._
   - **Note**: You should only have **one** spreadsheet file inside this folder at a time.
4. **Dates Support**: If your columns contain dates, they can be formatted in the standard format `DD/MM/YYYY` (for example: `21/02/2026`). The application will automatically detect and parse them as dates.

> [!NOTE]
> If you do not add any custom spreadsheet file in this folder, the application will automatically fall back to showing a default demonstration list of student course records.

---

## 📦 Step 3: Install Project Dependencies

Next, you need to download the necessary code libraries for this application to run.

1. Open your **Command Prompt** (Windows) or **Terminal** (Mac).
2. Point the console to the project directory:
   ```bash
   cd c:\Users\HP\Downloads\spread-magic-17-main\spread-magic-17-main
   ```
3. (Optional) If you use NVS (Node Version Switcher), select node version 24 first:
   ```bash
   nvs use 24
   ```
4. Run the install command:
   ```bash
   npm install
   ```
   _This will download the required packages to a folder called `node_modules`. This step can take a minute._

---

## 🚀 Step 4: Run the Application

Now you are ready to start the application!

1. In the same command prompt or terminal window, run the start command:
   ```bash
   npm run dev
   ```
2. The terminal will compile the spreadsheet file and start a local web server. You will see output like this:

   ```text
   [loadSpreadsheet] Found spreadsheet file: students.xlsx. Parsing...
   [loadSpreadsheet] Successfully compiled 9 rows from students.xlsx.

    Local:   http://localhost:3000/
   ```

3. Copy the link `http://localhost:3000/` and paste it into your web browser (Google Chrome, Microsoft Edge, Safari, etc.).
4. The application is now running!

---

## 🔍 How to Use the Explorer

- **Search**: In the left sidebar panel, type any term (like a name, ID number, or course name) in the **Search** box. The spreadsheet table on the right will instantly filter and display only the matching records.
- **Empty State**: By default, the table will be empty when you open the page to keep the view clean. Simply type in the search box to reveal records.
- **Sorting**: Click on any column header in the table (e.g. `Name`, `ID_Number`, or `Start_date`) to sort the spreadsheet rows in ascending or descending order.
