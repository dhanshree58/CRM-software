import React from "react"
import { RefreshCw, Search } from "lucide-react";

export default function DeliveryToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
  loading,
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search order, customer or delivery person..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      </div>

      <select
        className="filter-select"
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <option value="ALL">All Status</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="OUT_FOR_DELIVERY">
          Out for Delivery
        </option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw size={17} />
        Refresh
      </button>
    </div>
  );
}