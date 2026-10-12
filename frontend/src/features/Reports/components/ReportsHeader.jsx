import React from "react"
import { RefreshCw, Download } from "lucide-react";

export default function ReportsHeader({
  onRefresh,
  onExport,
  loading,
}) {
  return (
    <div className="page-header">
      <div>
        <h1>Reports</h1>
        <p>
          Analyze sales, orders, customers and product performance.
        </p>
      </div>

      <div className="page-header-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onExport}
          disabled={loading}
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>
    </div>
  );
}