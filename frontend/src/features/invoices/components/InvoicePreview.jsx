import React from "react"
import { Printer } from "lucide-react";
import Modal from "../../../components/Modal";

import {
  formatCurrency,
  formatDate,
  getInvoiceNumber,
} from "../utils/invoiceUtils";

export default function InvoicePreview({
  invoice,
  open,
  onClose,
  onPrint,
}) {
  if (!invoice) {
    return (
      <Modal
        open={open}
        title="Invoice"
        onClose={onClose}
      />
    );
  }

  return (
    <Modal
      open={open}
      title={`Invoice - ${getInvoiceNumber(invoice)}`}
      onClose={onClose}
    >
      <div className="invoice-preview">
        <div className="invoice-preview-header">
          <div>
            <div className="invoice-brand">BusinessCRM</div>
            <p>Order Management System</p>
          </div>

          <div className="invoice-preview-title">
            <h2>INVOICE</h2>
            <span>{getInvoiceNumber(invoice)}</span>
          </div>
        </div>

        <div className="invoice-info-grid">
          <div>
            <span>BILL TO</span>
            <strong>
              {invoice.customer_name || "Walk-in Customer"}
            </strong>
            <p>{invoice.customer_phone || "-"}</p>
            <p>{invoice.customer_address || ""}</p>
          </div>

          <div>
            <span>ORDER DETAILS</span>
            <p>
              <strong>Order: </strong>
              {invoice.order_number || "-"}
            </p>
            <p>
              <strong>Date: </strong>
              {formatDate(invoice.created_at)}
            </p>
            <p>
              <strong>Payment: </strong>
              {invoice.payment_method || "-"}
            </p>
          </div>
        </div>

        <div className="invoice-items">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(invoice.items) &&
              invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td>
                      {item.product_name || item.name || "-"}
                    </td>
                    <td>{item.quantity ?? 0}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No item details available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="invoice-totals">
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(invoice.subtotal)}</strong>
          </div>

          <div>
            <span>Discount</span>
            <strong>
              - {formatCurrency(invoice.discount)}
            </strong>
          </div>

          <div>
            <span>GST / Tax</span>
            <strong>{formatCurrency(invoice.tax)}</strong>
          </div>

          <div className="invoice-grand-total">
            <span>Grand Total</span>
            <strong>{formatCurrency(invoice.total)}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onPrint}
          >
            <Printer size={17} />
            Print Invoice
          </button>
        </div>
      </div>
    </Modal>
  );
}