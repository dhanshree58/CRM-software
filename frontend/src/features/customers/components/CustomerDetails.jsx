import React from "react";
import { Pencil } from "lucide-react";
import Modal from "../../../components/Modal";
import {
  formatCurrency,
  formatDate,
} from "../utils/customerUtils";

export default function CustomerDetails({
  customer,
  open,
  onClose,
  onEdit,
}) {
  return (
    <Modal
      open={open}
      title="Customer Details"
      onClose={onClose}
    >
      {customer && (
        <div className="customer-details">
          <div className="customer-detail-header">
            <div className="large-avatar">
              {customer.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <h2>{customer.name}</h2>
              <span>Customer #{customer.id}</span>
            </div>
          </div>

          <div className="details-grid">
            <div>
              <span>Phone</span>
              <strong>{customer.phone || "-"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{customer.email || "-"}</strong>
            </div>

            <div>
              <span>City</span>
              <strong>{customer.city || "-"}</strong>
            </div>

            <div>
              <span>State</span>
              <strong>{customer.state || "-"}</strong>
            </div>

            <div>
              <span>Pincode</span>
              <strong>{customer.pincode || "-"}</strong>
            </div>

            <div>
              <span>Joined</span>
              <strong>{formatDate(customer.created_at)}</strong>
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{customer.order_count || 0}</strong>
            </div>

            <div>
              <span>Total Spent</span>
              <strong>{formatCurrency(customer.total_spent)}</strong>
            </div>
          </div>

          <div className="customer-address">
            <span>Address</span>
            <p>{customer.address || "No address available."}</p>
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
              onClick={() => onEdit(customer)}
            >
              <Pencil size={16} />
              Edit Customer
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}