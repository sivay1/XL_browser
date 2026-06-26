import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConfigProvider, Layout, Typography, theme, Card, Alert } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { UploadZone } from "@/components/spreadsheet/UploadZone";
import { UploadHistory } from "@/components/spreadsheet/UploadHistory";
import { DataExplorer } from "@/components/spreadsheet/DataExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spreadsheet Explorer" },
      {
        name: "description",
        content:
          "Upload any Excel or CSV file and explore it with auto-generated filters and search, all in your browser.",
      },
      { property: "og:title", content: "Spreadsheet Explorer" },
      {
        property: "og:description",
        content: "Upload any Excel or CSV file and explore it instantly in your browser.",
      },
    ],
  }),
  component: Index,
  ssr: false,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2c7d4f",
          borderRadius: 10,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "#fafaf7" }}>
        <Layout.Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 24px",
          }}
        >
          <TableOutlined style={{ fontSize: 22, color: "#2c7d4f" }} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            Spreadsheet Explorer
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            Upload · Browse · Filter · Search
          </Typography.Text>
        </Layout.Header>

        <Layout style={{ padding: 24, gap: 16 }}>
          <Layout.Sider
            width={300}
            style={{
              background: "transparent",
              marginRight: 16,
            }}
          >
            <Card title="Upload" size="small" style={{ marginBottom: 16 }}>
              <UploadZone onUploaded={setActiveId} />
            </Card>
            <Card title="History" size="small">
              <UploadHistory activeId={activeId} onSelect={setActiveId} />
            </Card>
          </Layout.Sider>

          <Layout.Content>
            {activeId == null ? (
              <Card style={{ textAlign: "center", padding: 48 }}>
                <Typography.Title level={3} style={{ marginTop: 0 }}>
                  No file selected
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ maxWidth: 520, margin: "0 auto" }}>
                  Upload an Excel or CSV file to get started. Columns and filters are generated
                  automatically based on your data: text, numbers, dates, and categorical fields
                  each get the right control.
                </Typography.Paragraph>
                <Alert
                  style={{ marginTop: 24, textAlign: "left", maxWidth: 520, marginInline: "auto" }}
                  type="info"
                  showIcon
                  title="Demo mode"
                  description="All parsing and storage happens in your browser. Nothing is uploaded to a server. Your data survives a refresh."
                />
              </Card>
            ) : (
              <DataExplorer uploadId={activeId} />
            )}
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
