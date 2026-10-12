import React from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#ef4444",
];

export default function OrderStatusChart({ data }) {
  const dataKey = data[0]?.count ? "count" : "value";
  const nameKey = data[0]?.status ? "status" : "name";

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Order Status</h3>
          <span>Order distribution</span>
        </div>
      </div>

      <div className="chart-container">
        {data.length === 0 ? (
          <div className="chart-empty">
            No order status data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="45%"
                outerRadius={100}
                innerRadius={45}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item[nameKey] ?? "status"}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}