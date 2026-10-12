import React from "react";
import { RefreshCw, Search } from "lucide-react";

export default function CustomerToolbar({
  search,
  onSearchChange,
  onRefresh,
  loading,
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      </div>

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