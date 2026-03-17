import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/DashboardNavbar.css";
import logoIcon from "../assets/Icon.png";
import defaultAvatar from "../assets/avatar1.jpg";

function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Extract base path to determine active section
  const currentPath = location.pathname;
  const isCustomerDashboard = currentPath.startsWith("/customer/");
  const isDesignerDashboard = currentPath.startsWith("/designer/");

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    };

    const handleStorage = (event) => {
      if (!event.key || event.key === "user") {
        syncUser();
      }
    };

    syncUser();
    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-container">

        {/* Logo Section */}
        <Link to="/" className="dashboard-logo-link">
          <div className="dashboard-logo">
            <div className="dashboard-logo-icon-box">
              <img
                src={logoIcon}
                alt="Roomio Logo"
                className="dashboard-logo-icon"
              />
            </div>
            <span className="dashboard-logo-text">Roomio</span>
          </div>
        </Link>

        {/* Navigation Links - Dynamic based on user type */}
        {isCustomerDashboard && (
          <nav className="dashboard-nav-links">
            <Link to="/customer/dashboard" className={`dashboard-nav-link ${isActive("/customer/dashboard")}`}>
              Dashboard
            </Link>
            <Link to="/customer/my-designs" className={`dashboard-nav-link ${isActive("/customer/my-designs")}`}>
              My Designs
            </Link>
            <Link to="/customer/library" className={`dashboard-nav-link ${isActive("/customer/library")}`}>
              Library
            </Link>
            <Link to="/customer/inspiration" className={`dashboard-nav-link ${isActive("/customer/inspiration")}`}>
              Inspiration
            </Link>
            <Link to="/customer/settings" className={`dashboard-nav-link ${isActive("/customer/settings")}`}>
              Settings
            </Link>
          </nav>
        )}

        {isDesignerDashboard && (
          <nav className="dashboard-nav-links">
            <Link to="/designer/dashboard" className={`dashboard-nav-link ${isActive("/designer/dashboard")}`}>
              Dashboard
            </Link>
            <Link to="/designer/portfolio" className={`dashboard-nav-link ${isActive("/designer/portfolio")}`}>
              Portfolio
            </Link>
            <Link to="/designer/library" className={`dashboard-nav-link ${isActive("/designer/library")}`}>
              Library
            </Link>
            <Link to="/designer/inspiration" className={`dashboard-nav-link ${isActive("/designer/inspiration")}`}>
              Inspiration
            </Link>
            <Link to="/designer/settings" className={`dashboard-nav-link ${isActive("/designer/settings")}`}>
              Settings
            </Link>
          </nav>
        )}

        {/* Right Side */}
        <div className="dashboard-nav-actions">
          <div className="dashboard-icon-btn">🔔</div>
          <div className="dashboard-avatar">
            <img
              src={user?.avatar || defaultAvatar}
              alt={user?.name || "avatar"}
            />
          </div>
          <button className="dashboard-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}

export default DashboardNavbar;
