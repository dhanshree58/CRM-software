import React from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatCurrency } from "../utils/reportUtils";

export default function SalesChart({ data }) {
  return (
    <div className="panel report-large">
      <div className="panel-head">
        <div>
          <h3>Sales Performance</h3>
          <span>Revenue trend</span>
        </div>
      </div>

      <div className="chart-container">
        {data.length === 0 ? (
          <div className="chart-empty">
            No sales data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={data[0]?.date ? "date" : "month"}
              />

              <YAxis />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.12}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}