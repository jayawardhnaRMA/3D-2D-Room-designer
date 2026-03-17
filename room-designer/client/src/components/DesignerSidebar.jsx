import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/DesignerSidebar.css";
import { Briefcase, Folder, Image as ImageIcon, Settings, LayoutDashboard, Users } from "lucide-react";

export default function DesignerSidebar() {
  const location = useLocation();
  
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="designer-sidebar">

      <nav className="sidebar-nav">
        <Link to="/designer/dashboard" className={`nav-item ${isActive("/designer/dashboard")}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/designer/portfolio" className={`nav-item ${isActive("/designer/portfolio")}`}>
          <Briefcase size={20} />
          <span>Portfolio</span>
        </Link>
        <Link to="/designer/library" className={`nav-item ${isActive("/designer/library")}`}>
          <Folder size={20} />
          <span>Library</span>
        </Link>
        <Link to="/designer/inspiration" className={`nav-item ${isActive("/designer/inspiration")}`}>
          <ImageIcon size={20} />
          <span>Inspiration</span>
        </Link>
        <Link to="/designer/clients" className={`nav-item ${isActive("/designer/clients")}`}>
          <Users size={20} />
          <span>Clients</span>
        </Link>
        <Link to="/designer/settings" className={`nav-item ${isActive("/designer/settings")}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}

