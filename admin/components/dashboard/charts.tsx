"use client";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart wrappers.
 *
 * Recharts needs a measured DOM, so these are client components sized by
 * `ResponsiveContainer` — the parent must give them a height. Colours come
 * from the palette, passed as hex because Recharts writes them into SVG
 * attributes where `var()` is not resolved.
 */

export const SERIES_COLORS = {
  flexi: "#0066ff",
  savings: "#e58600",
  roi: "#00ac36",
} as const;

export type FundsPoint = {
  month: string;
  flexi: number;
  savings: number;
  roi: number;
};

const axisStyle = {
  fontSize: 12,
  fill: "#818181",
} as const;

export function SystemFundsChart({ data }: { data: FundsPoint[] }) {
  /* The series is sampled far more often than it is labelled, so the axis skips
     everything between one month's first reading and the next month's. */
  const monthStart = data.findIndex(
    (point, index) => index > 0 && point.month !== data[index - 1].month,
  );
  const tickInterval = monthStart > 0 ? monthStart - 1 : 0;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e8e8e8" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            interval={tickInterval}
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            tickFormatter={(value: number) => (value ? `₦${value}M` : "0")}
            width={56}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              fontSize: 12,
            }}
            formatter={(value) => `₦${value}M`}
          />
          <Line
            type="linear"
            dataKey="flexi"
            name="Flexi Wallet"
            stroke={SERIES_COLORS.flexi}
            strokeWidth={1.75}
            dot={false}
          />
          <Line
            type="linear"
            dataKey="savings"
            name="Savings Wallet"
            stroke={SERIES_COLORS.savings}
            strokeWidth={1.75}
            dot={false}
          />
          <Line
            type="linear"
            dataKey="roi"
            name="ROI Liability"
            stroke={SERIES_COLORS.roi}
            strokeWidth={1.75}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export type BreakdownSlice = {
  name: string;
  value: number;
  color: string;
};

export function FundsBreakdownChart({ data }: { data: BreakdownSlice[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="100%"
            paddingAngle={1}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Shared legend for both charts. */
export function ChartLegend({
  items,
}: {
  items: { label: string; color: string; value?: string }[];
}) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-grey-600">{item.label}</span>
          {item.value ? (
            <span className="font-semibold text-grey-900">{item.value}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
