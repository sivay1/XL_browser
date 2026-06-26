import { Collapse, Select, Input, Slider, DatePicker, Radio, Typography, Button } from "antd";
import type { ColumnMeta } from "@/lib/spreadsheet/types";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export type FilterValue =
  | { kind: "facet"; values: string[] }
  | { kind: "text"; value: string }
  | { kind: "range"; min: number; max: number }
  | { kind: "dateRange"; from: string | null; to: string | null }
  | { kind: "boolean"; value: "true" | "false" | "all" };

export type FilterState = Record<string, FilterValue | undefined>;

interface Props {
  columns: ColumnMeta[];
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function FilterPanel({ columns, value, onChange }: Props) {
  const set = (name: string, v: FilterValue | undefined) => {
    const next = { ...value };
    if (v === undefined) delete next[name];
    else next[name] = v;
    onChange(next);
  };

  const activeCount = Object.keys(value).length;

  const items = columns.map((col) => {
    const current = value[col.name];
    let body: React.ReactNode = null;
    if (col.filterKind === "facet" && col.facetValues) {
      const v = current?.kind === "facet" ? current.values : [];
      body = (
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Any"
          value={v}
          options={col.facetValues.map((x) => ({ value: x, label: x }))}
          onChange={(vals) =>
            set(col.name, vals.length ? { kind: "facet", values: vals } : undefined)
          }
          maxTagCount="responsive"
        />
      );
    } else if (col.filterKind === "text") {
      const v = current?.kind === "text" ? current.value : "";
      body = (
        <Input
          allowClear
          placeholder="Contains…"
          value={v}
          onChange={(e) =>
            set(col.name, e.target.value ? { kind: "text", value: e.target.value } : undefined)
          }
        />
      );
    } else if (col.filterKind === "range" && col.min != null && col.max != null) {
      const min = col.min;
      const max = col.max;
      const v = current?.kind === "range" ? [current.min, current.max] : [min, max];
      body = (
        <div>
          <Slider
            range
            min={min}
            max={max}
            step={(max - min) / 100 || 1}
            value={v as [number, number]}
            onChange={(vals) => {
              const [a, b] = vals as [number, number];
              if (a === min && b === max) set(col.name, undefined);
              else set(col.name, { kind: "range", min: a, max: b });
            }}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {v[0]} – {v[1]}
          </Typography.Text>
        </div>
      );
    } else if (col.filterKind === "dateRange") {
      const v = current?.kind === "dateRange" ? current : null;
      body = (
        <DatePicker.RangePicker
          style={{ width: "100%" }}
          value={v && v.from && v.to ? [dayjs(v.from), dayjs(v.to)] : null}
          onChange={(range) => {
            const r = range as [Dayjs | null, Dayjs | null] | null;
            if (!r || !r[0] || !r[1]) set(col.name, undefined);
            else
              set(col.name, {
                kind: "dateRange",
                from: r[0].toISOString(),
                to: r[1].toISOString(),
              });
          }}
        />
      );
    } else if (col.filterKind === "boolean") {
      const v = current?.kind === "boolean" ? current.value : "all";
      body = (
        <Radio.Group
          value={v}
          onChange={(e) =>
            set(
              col.name,
              e.target.value === "all" ? undefined : { kind: "boolean", value: e.target.value },
            )
          }
          optionType="button"
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="true">True</Radio.Button>
          <Radio.Button value="false">False</Radio.Button>
        </Radio.Group>
      );
    }

    return {
      key: col.name,
      label: (
        <span>
          {col.name}{" "}
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {col.type}
          </Typography.Text>
          {current ? <span style={{ marginLeft: 6, color: "#1677ff" }}>●</span> : null}
        </span>
      ),
      children: body,
    };
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <Typography.Text strong>Filters</Typography.Text>
        {activeCount > 0 && (
          <Button size="small" type="link" onClick={() => onChange({})}>
            Clear ({activeCount})
          </Button>
        )}
      </div>
      <Collapse
        items={items}
        defaultActiveKey={columns.filter((c) => c.filterKind === "facet").slice(0, 3).map((c) => c.name)}
        size="small"
        ghost
      />
    </div>
  );
}
