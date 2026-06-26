import { Upload, message, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { parseFile } from "@/lib/spreadsheet/parseFile";
import { analyzeColumns } from "@/lib/spreadsheet/columnAnalysis";
import { getDB } from "@/lib/spreadsheet/db";

const { Dragger } = Upload;

interface Props {
  onUploaded: (uploadId: number) => void;
}

export function UploadZone({ onUploaded }: Props) {
  return (
    <Dragger
      multiple={false}
      accept=".xlsx,.xls,.csv"
      beforeUpload={async (file) => {
        try {
          message.loading({ content: `Parsing ${file.name}…`, key: "up" });
          const { headers, rows } = await parseFile(file as File);
          if (headers.length === 0) {
            message.error({ content: "No data found in file", key: "up" });
            return Upload.LIST_IGNORE;
          }
          const columns = analyzeColumns(headers, rows);
          const db = getDB();
          const uploadId = await db.transaction("rw", db.uploads, db.rows, async () => {
            const id = await db.uploads.add({
              name: file.name,
              uploadedAt: Date.now(),
              rowCount: rows.length,
              columns,
            });
            await db.rows.bulkAdd(rows.map((data) => ({ uploadId: id as number, data })));
            return id as number;
          });
          message.success({ content: `Loaded ${rows.length} rows`, key: "up" });
          onUploaded(uploadId);
        } catch (err) {
          console.error(err);
          message.error({ content: `Failed to parse: ${(err as Error).message}`, key: "up" });
        }
        return Upload.LIST_IGNORE;
      }}
      showUploadList={false}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Drop an Excel or CSV file here, or click to browse</p>
      <Typography.Text type="secondary">
        Supports .xlsx, .xls, .csv, parsed entirely in your browser
      </Typography.Text>
    </Dragger>
  );
}
