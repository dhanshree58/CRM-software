import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatCurrency } from "../utils/reportUtils";

export default function ProductPerformance({ data }) {
  const nameKey = data[0]?.product_name
    ? "product_name"
    : "name";

  const salesKey = data[0]?.sales
    ? "sales"
    : "total_sales";

  return (
    <div className="panel report-large">
      <div className="panel-head">
        <div>
          <h3>Product Performance</h3>
          <span>Top selling products</span>
        </div>
      </div>

      <div className="chart-container">
        {data.length === 0 ? (
          <div className="chart-empty">
            No product sales data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 30, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey={nameKey}
                width={120}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
              />

              <Bar
                dataKey={salesKey}
                fill="#2563eb"
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}