
import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Truck,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Products", path: "/products", icon: Package },
  { name: "Invoices", path: "/invoices", icon: FileText },
  { name: "Deliveries", path: "/deliveries", icon: Truck },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="logo-container">
        <div className="logo-icon">B</div>

        <div className="logo-text">
          <h2>BusinessCRM</h2>
          <span>Order Management</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="menu-title">MAIN MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item settings-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>

        <div className="sidebar-user">
          <div className="avatar">AD</div>

          <div className="sidebar-user-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
