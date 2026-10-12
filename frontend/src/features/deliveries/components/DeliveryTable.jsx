import React from "react"
import {
  Eye,
  Pencil,
  Truck,
  MapPin,
  Phone,
} from "lucide-react";

import {
  formatDate,
  formatStatus,
  getStatusClass,
} from "../utils/deliveryUtils";

export default function DeliveryTable({
  deliveries,
  loading,
  onView,
  onEdit,
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Delivery Management</h3>
          <span>{deliveries.length} deliveries</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading deliveries...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Delivery Person</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Delivered</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No deliveries found.
                  </td>
                </tr>
              ) : (
                deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <div className="order-cell">
                        <div className="truck-icon">
                          <Truck size={17} />
                        </div>

                        <div>
                          <strong>
                            {delivery.order_number ||
                              `#${delivery.order_id}`}
                          </strong>
                          <span>Order</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <strong>
                          {delivery.customer_name || "-"}
                        </strong>
                        <span>
                          {delivery.customer_phone || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {delivery.delivery_person || "-"}
                      </strong>
                    </td>

                    <td>
                      <div className="contact-info">
                        <span>
                          <Phone size={13} />
                          {delivery.phone || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="address-cell">
                        <MapPin size={14} />
                        <span>{delivery.address || "-"}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          delivery.status
                        )}
                      >
                        {formatStatus(delivery.status)}
                      </span>
                    </td>

                    <td>
                      {delivery.delivered_at
                        ? formatDate(delivery.delivered_at)
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="icon-btn"
                          title="View delivery"
                          onClick={() => onView(delivery)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="icon-btn"
                          title="Edit delivery"
                          onClick={() => onEdit(delivery)}
                        >
                          <Pencil size={17} />
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