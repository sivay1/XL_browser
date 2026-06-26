import { List, Button, Empty, Popconfirm, Tag, Typography } from "antd";
import { DeleteOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { getDB } from "@/lib/spreadsheet/db";

interface Props {
  activeId: number | null;
  onSelect: (id: number | null) => void;
}

export function UploadHistory({ activeId, onSelect }: Props) {
  const uploads = useLiveQuery(async () => {
    const db = getDB();
    return db.uploads.orderBy("uploadedAt").reverse().toArray();
  }, []);

  if (!uploads) return null;
  if (uploads.length === 0) {
    return <Empty description="No uploads yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <List
      size="small"
      dataSource={uploads}
      renderItem={(u) => {
        const active = u.id === activeId;
        return (
          <List.Item
            style={{
              cursor: "pointer",
              padding: "10px 12px",
              borderRadius: 8,
              background: active ? "rgba(22,119,255,0.08)" : undefined,
              border: active ? "1px solid #1677ff" : "1px solid transparent",
              marginBottom: 6,
            }}
            onClick={() => u.id != null && onSelect(u.id)}
            actions={[
              <Popconfirm
                key="del"
                title="Delete this upload?"
                onConfirm={async (e) => {
                  e?.stopPropagation();
                  const db = getDB();
                  await db.transaction("rw", db.uploads, db.rows, async () => {
                    await db.rows.where("uploadId").equals(u.id!).delete();
                    await db.uploads.delete(u.id!);
                  });
                  if (u.id === activeId) {
                    onSelect(null);
                  }
                }}
                onCancel={(e) => e?.stopPropagation()}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<FileExcelOutlined style={{ fontSize: 20, color: "#2c7d4f" }} />}
              title={<Typography.Text ellipsis style={{ maxWidth: 180 }}>{u.name}</Typography.Text>}
              description={<Tag>{u.rowCount} rows · {u.columns.length} cols</Tag>}
            />
          </List.Item>
        );
      }}
    />
  );
}
