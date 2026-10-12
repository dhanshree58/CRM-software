import React from "react"
import {
  formatCurrency,
  formatNumber,
} from "../utils/reportUtils";

export default function ProductSalesTable({ data }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Product Sales Summary</h3>
          <span>Detailed product performance</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Total Sales</th>
              <th>Performance</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No product data available.
                </td>
              </tr>
            ) : (
              data.map((product, index) => {
                const quantity =
                  product.quantity ||
                  product.total_quantity ||
                  0;

                const sales =
                  product.sales ||
                  product.total_sales ||
                  0;

                return (
                  <tr
                    key={
                      product.product_id ??
                      product.id ??
                      `${product.product_name || product.name}-${index}`
                    }
                  >
                    <td>
                      <div className="product-cell">
                        <div className="product-icon">
                          {index + 1}
                        </div>

                        <div>
                          <strong>
                            {product.product_name ||
                              product.name ||
                              "-"}
                          </strong>
                          <span>Product</span>
                        </div>
                      </div>
                    </td>

                    <td>{formatNumber(quantity)}</td>

                    <td>
                      <strong>{formatCurrency(sales)}</strong>
                    </td>

                    <td>
                      <span className="stock-status stock-good">
                        {index === 0 ? "Top Seller" : "Selling"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}