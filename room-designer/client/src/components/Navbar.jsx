import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import defaultAvatar from "../assets/avatar1.jpg";
const logoSrc = "/Logo 1.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY || 0;
      const isScrollingDown = current > lastScrollY.current;

      setIsHidden(isScrollingDown && current > 80);
      setIsScrolled(current > 8);
      lastScrollY.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className={`navbar${isHidden ? " navbar--hidden" : ""}${isScrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar-container">

        {/* Logo Section */}
        <Link to="/" className="logo-link">
          <div className="logo">
            <div className="logo-icon-box">
              <img
                src={logoSrc}
                alt="Roomio Logo"
                className="logo-icon"
              />
            </div>
            <span className="logo-text">Roomio</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
          <Link to="/how-it-works" className={`nav-link ${isActive("/how-it-works")}`}>How It Works</Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>Contact</Link>
        </nav>

        {/* Right Side */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
              <button
                onClick={() => navigate(user.role === "designer" ? "/designer/dashboard" : "/customer/dashboard")}
                style={{
                  background: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(user.role === "designer" ? "/designer/dashboard" : "/customer/my-designs")}
                style={{
                  background: "transparent",
                  color: "#4f46e5",
                  border: "1.5px solid #c7d2fe",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Create Design
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img 
                  src="https://www.w3schools.com/howto/img_avatar.png" 
                  alt={user.name} 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ color: "#0f172a", fontSize: "14px", fontWeight: "500" }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "18px",
                  padding: "4px 8px",
                }}
              >
                ▼
              </button>
              {isDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minWidth: "160px",
                  zIndex: 1000,
                  marginTop: "8px",
                }}>
                  <Link to={user.role === "designer" ? "/designer/settings" : "/customer/settings"}
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      color: "#0f172a",
                      textDecoration: "none",
                      borderBottom: "1px solid #e2e8f0",
                      fontSize: "14px",
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login">Login</Link>
              <Link to="/signup">
                <button className="get-started">Get Started</button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;