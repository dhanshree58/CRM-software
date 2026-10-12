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

export default function PaymentChart({ data }) {
  const dataKey = data[0]?.amount ? "amount" : "value";
  const nameKey = data[0]?.method ? "method" : "name";

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Payment Breakdown</h3>
          <span>Payment methods</span>
        </div>
      </div>

      <div className="chart-container">
        {data.length === 0 ? (
          <div className="chart-empty">
            No payment data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item[nameKey] ?? "payment"}-${index}`}
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