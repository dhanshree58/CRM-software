import React from "react"
import { Plus } from "lucide-react";
import {
  calculateItemPrice,
  calculateOrderTotals,
  formatCurrency,
} from "../utils/orderUtils";

export default function OrderItemsEditor({
  products,
  items,
  discount,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onDiscountChange,
}) {
  const totals = calculateOrderTotals(items, products, discount);

  return (
    <>
      <div className="form-section">
        <div className="form-section-header">
          <h3>Order Items</h3>

          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onAddItem}
          >
            <Plus size={15} />
            Add Item
          </button>
        </div>

        {items.map((item, index) => {
          const price = calculateItemPrice(
            products,
            item.product_id
          );

          return (
            <div className="order-item-row" key={index}>
              <div className="form-group">
                <label>Product</label>

                <select
                  value={item.product_id}
                  onChange={(event) =>
                    onUpdateItem(
                      index,
                      "product_id",
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">Select product</option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} -{" "}
                      {formatCurrency(product.selling_price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(event) =>
                    onUpdateItem(
                      index,
                      "quantity",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="item-price">
                <label>Price</label>
                <strong>
                  {formatCurrency(
                    price * Number(item.quantity || 0)
                  )}
                </strong>
              </div>

              <button
                type="button"
                className="remove-item"
                onClick={() => onRemoveItem(index)}
                disabled={items.length === 1}
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="order-summary">
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(totals.subtotal)}</strong>
        </div>

        <div>
          <span>Discount</span>

          <input
            type="number"
            min="0"
            max={totals.subtotal}
            value={discount}
            onChange={(event) =>
              onDiscountChange(event.target.value)
            }
          />
        </div>

        <div>
          <span>GST (18%)</span>
          <strong>{formatCurrency(totals.tax)}</strong>
        </div>

        <div className="order-total">
          <span>Total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
      </div>
    </>
  );
}