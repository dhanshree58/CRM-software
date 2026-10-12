import React from "react";
import { RefreshCw, Search } from "lucide-react";

export default function ProductToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onRefresh,
  loading,
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search product, SKU or category..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      </div>

      <select
        className="filter-select"
        value={categoryFilter}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
      >
        <option value="ALL">All Categories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
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