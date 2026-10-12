import React from "react"
import { Eye } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/orderUtils";

export default function OrderTable({
  orders,
  loading,
  onView,
  onStatusChange,
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>All Orders</h3>
          <span>{orders.length} orders found</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
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

                    <td>{order.item_count ?? "-"}</td>

                    <td>
                      <strong>{formatCurrency(order.total)}</strong>
                    </td>

                    <td>
                      <span className="payment-badge">
                        {order.payment_status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={order.status || "PENDING"}
                        onChange={(event) =>
                          onStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => onView(order)}
                        title="View order"
                      >
                        <Eye size={17} />
                      </button>
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