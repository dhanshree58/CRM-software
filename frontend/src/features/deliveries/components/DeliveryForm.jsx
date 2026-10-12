import React from "react"
import Modal from "../../../components/Modal";

export default function DeliveryForm({
  open,
  editingDelivery,
  form,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={
        editingDelivery ? "Edit Delivery" : "Assign Delivery"
      }
      onClose={onClose}
    >
      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Order ID</label>
            <input
              type="number"
              name="order_id"
              min="1"
              placeholder="Enter order ID"
              value={form.order_id}
              onChange={onChange}
              disabled={Boolean(editingDelivery)}
              required
            />
            <small className="form-help">
              Enter the ID of the order that needs delivery.
            </small>
          </div>

          <div className="form-group">
            <label>Delivery Person</label>
            <input
              type="text"
              name="delivery_person"
              placeholder="Enter delivery person's name"
              value={form.delivery_person}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
            >
              <option value="ASSIGNED">Assigned</option>
              <option value="OUT_FOR_DELIVERY">
                Out for Delivery
              </option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Delivery Address</label>
          <textarea
            name="address"
            rows={4}
            placeholder="Enter complete delivery address"
            value={form.address}
            onChange={onChange}
            required
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary">
            {editingDelivery
              ? "Update Delivery"
              : "Assign Delivery"}
          </button>
        </div>
      </form>
    </Modal>
  );
}