
import React from "react";
import { Search, Bell } from "lucide-react";

function Header() {
  return (
    <header className="header">
      {/* Search */}
      <div className="header-search">
        <Search size={17} strokeWidth={1.8} />

        <input
          type="text"
          placeholder="Search orders, customers, products..."
          aria-label="Search orders, customers, and products"
        />
      </div>

      {/* Right side */}
      <div className="header-right">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="notification-dot" />
        </button>

        <div className="header-user">
          <div className="header-avatar">AD</div>

          <div className="header-user-info">
            <strong>Admin</strong>
            <span>Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
