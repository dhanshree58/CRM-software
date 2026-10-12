import React from "react";
import { Pencil, Trash2, Package } from "lucide-react";

import {
  formatCurrency,
  getStockStatus,
} from "../utils/productUtils";

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Product Inventory</h3>
          <span>{products.length} products</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>GST</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-icon">
                            <Package size={18} />
                          </div>

                          <div>
                            <strong>{product.name}</strong>
                            <span>Product #{product.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="sku">
                          {product.sku}
                        </span>
                      </td>

                      <td>{product.category || "-"}</td>

                      <td>
                        {formatCurrency(product.purchase_price)}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(product.selling_price)}
                        </strong>
                      </td>

                      <td>{Number(product.gst || 0)}%</td>

                      <td>
                        <strong
                          className={
                            Number(product.stock) === 0
                              ? "danger-text"
                              : ""
                          }
                        >
                          {product.stock ?? 0}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`stock-status ${stockStatus.className}`}
                        >
                          {stockStatus.text}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-btn"
                            title="Edit product"
                            onClick={() => onEdit(product)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            className="icon-btn danger-btn"
                            title="Delete product"
                            onClick={() => onDelete(product)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}