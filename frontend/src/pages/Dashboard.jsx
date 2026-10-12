import React from "react";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Truck,
  AlertTriangle,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { dashboardApi } from "../services/api";
import StatCard from "../components/StatCard";

const STATUS_COLORS = {
  PENDING: "#f59e0b",
  PROCESSING: "#6366f1",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatCompactCurrency = (value) => {
  const amount = Number(value) || 0;

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }

  return `₹${amount}`;
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await dashboardApi.get();

        if (active) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);

        if (active) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="loading dashboard-message">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading dashboard-message">
        <p>{error || "Unable to load dashboard."}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Normalize API data for charts.
  const salesData = (
    Array.isArray(data.salesChart) ? data.salesChart : []
  )
    .map((item) => ({
      day: item.day ?? item.date ?? item.month ?? "",
      sales: Number(item.sales ?? item.revenue ?? 0) || 0,
    }))
    .filter((item) => item.day !== "");

  const statusData = (
    Array.isArray(data.statusChart) ? data.statusChart : []
  )
    .map((item) => ({
      status: String(
        item.status ?? item.name ?? "UNKNOWN"
      ).toUpperCase(),
      count: Number(item.count ?? item.value ?? 0) || 0,
    }))
    .filter((item) => item.count > 0);

  const recentOrders = Array.isArray(data.recentOrders)
    ? data.recentOrders
    : [];

  const lowStock = Array.isArray(data.lowStock)
    ? data.lowStock
    : [];

  const totalStatusOrders = statusData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className="business-dashboard">
      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back. Here's your business overview.
          </p>
        </div>

        <div className="date-pill">
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <StatCard
          title="Total Sales"
          value={formatCurrency(data.totalSales)}
          change="Paid order revenue"
          icon={IndianRupee}
          type="blue"
        />

        <StatCard
          title="Total Orders"
          value={Number(data.totalOrders) || 0}
          change="Orders received"
          icon={ShoppingCart}
          type="purple"
        />

        <StatCard
          title="Customers"
          value={Number(data.totalCustomers) || 0}
          change="Registered customers"
          icon={Users}
          type="green"
        />

        <StatCard
          title="Pending Orders"
          value={Number(data.pendingOrders) || 0}
          change="Needs attention"
          icon={Truck}
          type="orange"
        />
      </div>

      {/* ANALYTICS */}
      <div className="dashboard-grid dashboard-analytics-grid">
        {/* SALES CHART */}
        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Sales Overview</h3>
              <span>Paid order revenue over time</span>
            </div>

            <span className="dashboard-chip">
              Revenue
            </span>
          </div>

          <div className="chart-container sales-chart-container">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{
                    top: 12,
                    right: 12,
                    left: 8,
                    bottom: 4,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e8edf5"
                  />

                  <XAxis
                    dataKey="day"
                    tickFormatter={formatDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    minTickGap={24}
                  />

                  <YAxis
                    tickFormatter={formatCompactCurrency}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    width={58}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                    labelFormatter={formatDate}
                    contentStyle={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      boxShadow:
                        "0 8px 24px rgba(15,23,42,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 0,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty dashboard-empty">
                <IndianRupee size={24} />
                <strong>No sales data available</strong>
                <span>
                  Sales will appear here when the API
                  returns revenue records.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ORDER STATUS CHART */}
        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Order Status</h3>
              <span>Current order distribution</span>
            </div>

            <span className="dashboard-chip">
              {totalStatusOrders} orders
            </span>
          </div>

          {statusData.length > 0 ? (
            <>
              <div className="donut-container status-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="46%"
                      innerRadius={58}
                      outerRadius={83}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {statusData.map((item, index) => (
                        <Cell
                          key={`${item.status}-${index}`}
                          fill={
                            STATUS_COLORS[item.status] ||
                            [
                              "#2563eb",
                              "#7c3aed",
                              "#16a34a",
                              "#f59e0b",
                            ][index % 4]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        `${value} orders`,
                        name,
                      ]}
                      contentStyle={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="dashboard-legend-label">
                          {String(value).replaceAll("_", " ")}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="donut-center">
                  <strong>{totalStatusOrders}</strong>
                  <span>Total orders</span>
                </div>
              </div>

              <div className="legend dashboard-status-legend">
                {statusData.map((item, index) => (
                  <div
                    className="legend-item"
                    key={`${item.status}-legend-${index}`}
                  >
                    <span
                      className="legend-dot"
                      style={{
                        background:
                          STATUS_COLORS[item.status] ||
                          "#94a3b8",
                      }}
                    />

                    <span>
                      {item.status.replaceAll("_", " ")}
                    </span>

                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="chart-empty dashboard-empty status-empty">
              <ShoppingCart size={24} />
              <strong>No order status data</strong>
              <span>
                Order counts will appear when the API
                returns status totals.
              </span>
            </div>
          )}
        </section>
      </div>

      {/* RECENT ORDERS AND LOW STOCK */}
      <div className="dashboard-grid dashboard-bottom-grid">
        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Orders</h3>
              <span>Latest transactions</span>
            </div>
          </div>

          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => {
                    const status = String(
                      order.status || "PENDING"
                    ).toLowerCase();

                    return (
                      <tr
                        key={
                          order.id ??
                          order.order_number ??
                          index
                        }
                      >
                        <td>
                          <strong>
                            {order.order_number ||
                              `Order ${index + 1}`}
                          </strong>
                        </td>

                        <td>
                          {order.customer_name || "—"}
                        </td>

                        <td>{formatCurrency(order.total)}</td>

                        <td>
                          <span className={`status ${status}`}>
                            {status.replaceAll("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Low Stock</h3>
              <span>Products needing attention</span>
            </div>

            <AlertTriangle
              size={18}
              className="low-stock-alert-icon"
            />
          </div>

          <div className="stock-list">
            {lowStock.length > 0 ? (
              lowStock.map((product, index) => (
                <div
                  className="stock-item"
                  key={product.id ?? product.sku ?? index}
                >
                  <div className="stock-product-info">
                    <strong>
                      {product.name || "Unnamed product"}
                    </strong>
                    <span>{product.sku || "No SKU"}</span>
                  </div>

                  <b className="stock-danger">
                    {Number(product.stock) || 0} left
                  </b>
                </div>
              ))
            ) : (
              <div className="stock-empty">
                <span className="stock-empty-icon">
                  <AlertTriangle size={18} />
                </span>
                <strong>All clear</strong>
                <span>
                  No low-stock products were returned.
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
