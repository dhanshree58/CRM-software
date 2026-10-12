import React from "react"
import Modal from "../../../components/Modal";
import {
  formatCurrency,
  formatDate,
  getStatusClass,
} from "../utils/orderUtils";

export default function OrderDetails({
  order,
  open,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={
        order ? `Order ${order.order_number || ""}` : "Order Details"
      }
      onClose={onClose}
    >
      {order && (
        <div className="order-details">
          <div className="details-grid">
            <div>
              <span>Customer</span>
              <strong>{order.customer_name || "Unknown"}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{order.customer_phone || "-"}</strong>
            </div>

            <div>
              <span>Order Date</span>
              <strong>{formatDate(order.created_at)}</strong>
            </div>

            <div>
              <span>Status</span>
              <span className={getStatusClass(order.status)}>
                {order.status || "Pending"}
              </span>
            </div>

            <div>
              <span>Payment</span>
              <strong>{order.payment_status || "Pending"}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </div>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="details-items">
              <h3>Items</h3>

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
                  {order.items.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td>
                        {item.product_name || item.name || "-"}
                      </td>
                      <td>{item.quantity ?? 0}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}