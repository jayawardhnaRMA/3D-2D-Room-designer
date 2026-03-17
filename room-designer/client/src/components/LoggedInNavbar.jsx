import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoggedInNavbar.css";
import logoIcon from "../assets/Icon.png";
import defaultAvatar from "../assets/avatar1.jpg";
import { LogOut } from "lucide-react";

function LoggedInNavbar({ userRole = "customer" }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isDesigner = userRole === "designer";

  return (
    <header className="logged-navbar">
      <div className="logged-navbar-container">
        {/* Logo Section */}
        <Link to={isDesigner ? "/designer/dashboard" : "/customer/dashboard"} className="logo-link">
          <div className="logo">
            <div className="logo-icon-box">
              <img src={logoIcon} alt="Roomio Logo" className="logo-icon" />
            </div>
            <span className="logo-text">Roomio</span>
          </div>
        </Link>
        
        {/* Right Side - User & Actions */}
        <div className="logged-nav-actions">
          <Link to={isDesigner ? "/designer/settings" : "/customer/settings"} className="profile-link">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "transparent",
              cursor: "pointer",
              transition: "transform 0.2s",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            title={user?.name || "Profile"}
            >
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default LoggedInNavbar;
