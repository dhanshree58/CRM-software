import React from "react";
import Modal from "../../../components/Modal";

export default function CustomerForm({
  open,
  editingCustomer,
  form,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={
        editingCustomer ? "Edit Customer" : "Add New Customer"
      }
      onClose={onClose}
    >
      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter customer name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
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
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="customer@example.com"
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter pincode"
              value={form.pincode}
              onChange={onChange}
              maxLength={6}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Enter complete address"
            value={form.address}
            onChange={onChange}
            rows={3}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={form.city}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={form.state}
              onChange={onChange}
            />
          </div>
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
            {editingCustomer ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}