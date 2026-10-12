import React from "react";
import { Eye, Pencil, Mail, Phone } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/customerUtils";

export default function CustomerTable({
  customers,
  loading,
  onView,
  onEdit,
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Customer List</h3>
          <span>{customers.length} customers</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-profile">
                        <div className="avatar">
                          {customer.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <strong>{customer.name}</strong>
                          <span>Customer #{customer.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <span>
                          <Phone size={13} />
                          {customer.phone || "-"}
                        </span>

                        {customer.email && (
                          <span>
                            <Mail size={13} />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {customer.city || customer.state
                        ? `${customer.city || ""}${
                            customer.city && customer.state
                              ? ", "
                              : ""
                          }${customer.state || ""}`
                        : "-"}
                    </td>

                    <td>
                      <strong>{customer.order_count || 0}</strong>
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(customer.total_spent)}
                      </strong>
                    </td>

                    <td>{formatDate(customer.created_at)}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="icon-btn"
                          title="View customer"
                          onClick={() => onView(customer)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="icon-btn"
                          title="Edit customer"
                          onClick={() => onEdit(customer)}
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