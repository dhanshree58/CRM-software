import React from "react"
import { Pencil, Truck, MapPin } from "lucide-react";
import Modal from "../../../components/Modal";

import {
  formatDate,
  formatStatus,
  getStatusClass,
} from "../utils/deliveryUtils";

export default function DeliveryDetails({
  delivery,
  open,
  onClose,
  onEdit,
}) {
  return (
    <Modal
      open={open}
      title="Delivery Details"
      onClose={onClose}
    >
      {delivery && (
        <div className="delivery-details">
          <div className="delivery-detail-header">
            <div className="large-truck-icon">
              <Truck size={28} />
            </div>

            <div>
              <h2>
                {delivery.order_number ||
                  `Order #${delivery.order_id}`}
              </h2>
              <span>Delivery #{delivery.id}</span>
            </div>
          </div>

          <div className="details-grid">
            <div>
              <span>Customer</span>
              <strong>{delivery.customer_name || "-"}</strong>
            </div>

            <div>
              <span>Customer Phone</span>
              <strong>{delivery.customer_phone || "-"}</strong>
            </div>

            <div>
              <span>Delivery Person</span>
              <strong>{delivery.delivery_person || "-"}</strong>
            </div>

            <div>
              <span>Delivery Phone</span>
              <strong>{delivery.phone || "-"}</strong>
            </div>

            <div>
              <span>Status</span>
              <span className={getStatusClass(delivery.status)}>
                {formatStatus(delivery.status)}
              </span>
            </div>

            <div>
              <span>Delivered Date</span>
              <strong>
                {delivery.delivered_at
                  ? formatDate(delivery.delivered_at)
                  : "Not delivered"}
              </strong>
            </div>
          </div>

          <div className="delivery-address">
            <div className="address-title">
              <MapPin size={17} />
              <strong>Delivery Address</strong>
            </div>

            <p>
              {delivery.address || "No address available."}
            </p>
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
              onClick={() => onEdit(delivery)}
            >
              <Pencil size={16} />
              Edit Delivery
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}