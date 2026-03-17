import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [accessDenied, setAccessDenied] = useState(false);
  const [deniedRole, setDeniedRole] = useState(null);

  useEffect(() => {
    setAccessDenied(false);
    setDeniedRole(null);
    
    if (isAuthenticated && user && requiredRole) {
      if (user.role !== requiredRole) {
        setAccessDenied(true);
        setDeniedRole(user.role);
        
        const timer = setTimeout(() => {
          if (user.role === "designer") {
            window.location.href = "/designer/dashboard";
          } else {
            window.location.href = "/customer/dashboard";
          }
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, requiredRole, location]);

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          textAlign: "center",
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}></div>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: 0,
          }}>
            Loading...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (accessDenied) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px 32px",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "32px",
          }}>
            ⛔
          </div>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 12px",
          }}>
            Access Denied
          </h2>
          <p style={{
            fontSize: "14px",
            color: "#64748b",
            margin: "0 0 12px",
            lineHeight: "1.6",
          }}>
            {requiredRole === "customer" 
              ? "You need to log in as a customer to access this page."
              : "You need to log in as a designer to access this page."}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#94a3b8",
            margin: "16px 0 0",
          }}>
            You are currently logged in as: <strong>{deniedRole}</strong>
          </p>
          <div style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#475569",
          }}>
            Redirecting to your dashboard in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
