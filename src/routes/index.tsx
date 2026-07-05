import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConfigProvider, Layout, Typography, theme, Card, Input } from "antd";
import { TableOutlined, SearchOutlined } from "@ant-design/icons";
import { DataExplorer } from "@/components/spreadsheet/DataExplorer";
import { MOCK_COLUMNS, MOCK_ROWS } from "@/lib/spreadsheet/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spreadsheet Explorer" },
      {
        name: "description",
        content: "Explore Excel data with instant search in your browser.",
      },
      { property: "og:title", content: "Spreadsheet Explorer" },
      {
        property: "og:description",
        content: "Explore Excel data instantly in your browser.",
      },
    ],
  }),
  component: Index,
  ssr: false,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const isMobile = useIsMobile();

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
            Browse · Search
          </Typography.Text>
        </Layout.Header>

        <Layout
          style={{
            padding: isMobile ? 12 : 24,
            height: "calc(100vh - 64px)",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden",
            gap: isMobile ? 12 : 0,
          }}
        >
          {isMobile ? (
            <Card title="Search" size="small" style={{ width: "100%", flexShrink: 0 }}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search across all columns…"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={{ width: "100%" }}
              />
            </Card>
          ) : (
            <Layout.Sider
              width={320}
              style={{
                background: "transparent",
                marginRight: 24,
                height: "100%",
                overflow: "auto",
              }}
            >
              <Card title="Search" size="small">
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="Search across all columns…"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  style={{ width: "100%" }}
                />
              </Card>
            </Layout.Sider>
          )}

          <Layout.Content
            style={{
              background: "#fff",
              padding: isMobile ? 12 : 24,
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              minWidth: 0,
              height: isMobile ? "calc(100% - 92px)" : "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <DataExplorer columns={MOCK_COLUMNS} data={MOCK_ROWS} globalFilter={globalFilter} />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
