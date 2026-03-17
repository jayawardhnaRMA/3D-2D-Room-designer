import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/CustomerSidebar.css";
import { Copy, Folder, Image as ImageIcon, Settings, LayoutDashboard } from "lucide-react";

export default function CustomerSidebar() {
  const location = useLocation();
  
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="customer-sidebar">

      <nav className="sidebar-nav">
        <Link to="/customer/dashboard" className={`nav-item ${isActive("/customer/dashboard")}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/customer/my-designs" className={`nav-item ${isActive("/customer/my-designs")}`}>
          <Copy size={20} />
          <span>My Designs</span>
        </Link>
        <Link to="/customer/library" className={`nav-item ${isActive("/customer/library")}`}>
          <Folder size={20} />
          <span>Library</span>
        </Link>
        <Link to="/customer/inspiration" className={`nav-item ${isActive("/customer/inspiration")}`}>
          <ImageIcon size={20} />
          <span>Inspiration</span>
        </Link>
        <Link to="/customer/settings" className={`nav-item ${isActive("/customer/settings")}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
