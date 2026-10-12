import React from "react"
import useReports from "./hooks/useReports";

import ReportsHeader from "./components/ReportsHeader";
import ReportSummary from "./components/ReportSummary";
import SalesChart from "./components/SalesChart";
import PaymentChart from "./components/PaymentChart";
import ProductPerformance from "./components/ProductPerformance";
import OrderStatusChart from "./components/OrderStatusChart";
import ProductSalesTable from "./components/ProductSalesTable";

import { exportReportCSV } from "./utils/reportUtils";

export default function Reports() {
  const {
    report,
    reportData,
    loading,
    error,
    loadReports,
  } = useReports();

  const handleExport = () => {
    if (!report) return;

    exportReportCSV(reportData);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <ReportsHeader
        onRefresh={loadReports}
        onExport={handleExport}
        loading={loading}
      />

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadReports}
          >
            Try Again
          </button>
        </div>
      )}

      {!error && (
        <>
          <ReportSummary
            totalSales={reportData.totalSales}
            totalOrders={reportData.totalOrders}
            totalCustomers={reportData.totalCustomers}
            averageOrderValue={reportData.averageOrderValue}
          />

          <div className="report-grid">
            <SalesChart data={reportData.salesData} />
            <PaymentChart data={reportData.paymentData} />
          </div>

          <div className="report-grid">
            <ProductPerformance data={reportData.productData} />
            <OrderStatusChart data={reportData.orderStatusData} />
          </div>

          <ProductSalesTable data={reportData.productData} />
        </>
      )}
    </div>
  );
}