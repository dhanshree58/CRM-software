import React from "react"
import Modal from "../../../components/Modal";
import OrderItemsEditor from "./OrderItemsEditor";

export default function OrderForm({
  open,
  customers,
  products,
  form,
  onChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onDiscountChange,
  onSubmit,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title="Create New Order"
      onClose={onClose}
    >
      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Customer</label>

            <select
              name="customer_id"
              value={form.customer_id}
              onChange={onChange}
              required
            >
              <option value="">Select customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method</label>

            <select
              name="payment_method"
              value={form.payment_method}
              onChange={onChange}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="COD">COD</option>
            </select>
          </div>
        </div>

        <OrderItemsEditor
          products={products}
          items={form.items}
          discount={form.discount}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
          onUpdateItem={onUpdateItem}
          onDiscountChange={onDiscountChange}
        />

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary">
            Create Order
          </button>
        </div>
      </form>
    </Modal>
  );
}