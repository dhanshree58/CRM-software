import React from "react"
import { Eye, FileText } from "lucide-react";

import {
  formatCurrency,
  formatDate,
  getInvoiceNumber,
} from "../utils/invoiceUtils";

export default function InvoiceTable({
  invoices,
  loading,
  onView,
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Invoice List</h3>
          <span>{invoices.length} invoices</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading invoices...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="invoice-cell">
                        <div className="invoice-icon">
                          <FileText size={18} />
                        </div>

                        <div>
                          <strong>
                            {getInvoiceNumber(order)}
                          </strong>
                          <span>Digital Invoice</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>{order.order_number || "-"}</strong>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <strong>
                          {order.customer_name || "Unknown"}
                        </strong>
                        <span>{order.customer_phone || "-"}</span>
                      </div>
                    </td>

                    <td>{formatDate(order.created_at)}</td>

                    <td>
                      <strong>
                        {formatCurrency(order.total)}
                      </strong>
                    </td>

                    <td>
                      <span className="payment-badge">
                        {order.payment_status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="icon-btn"
                          title="View invoice"
                          onClick={() => onView(order)}
                        >
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}