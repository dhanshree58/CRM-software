import React from "react"
import {
  TrendingUp,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";

import {
  formatCurrency,
  formatNumber,
} from "../utils/reportUtils";

export default function ReportSummary({
  totalSales,
  totalOrders,
  totalCustomers,
  averageOrderValue,
}) {
  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      icon: IndianRupee,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: formatNumber(totalOrders),
      icon: ShoppingCart,
      color: "purple",
    },
    {
      title: "Customers",
      value: formatNumber(totalCustomers),
      icon: Users,
      color: "green",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="stat-card" key={card.title}>
            <div className={`stat-icon ${card.color}`}>
              <Icon size={21} />
            </div>

            <div className="stat-content">
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}