import React from "react";
import Modal from "../../../components/Modal";

export default function ProductForm({
  open,
  editingProduct,
  form,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={editingProduct ? "Edit Product" : "Add New Product"}
      onClose={onClose}
    >
      <form className="form" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="form-section-header">
            <h3>Product Information</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="e.g. PROD-001"
                value={form.sku}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Hardware"
                value={form.category}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>GST (%)</label>
              <select
                name="gst"
                value={form.gst}
                onChange={onChange}
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>Pricing</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Purchase Price</label>
              <input
                type="number"
                name="purchase_price"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.purchase_price}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Selling Price</label>
              <input
                type="number"
                name="selling_price"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.selling_price}
                onChange={onChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>Inventory</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Current Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Low Stock Alert Limit</label>
              <input
                type="number"
                name="low_stock_limit"
                min="0"
                step="1"
                placeholder="5"
                value={form.low_stock_limit}
                onChange={onChange}
              />
            </div>
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
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}