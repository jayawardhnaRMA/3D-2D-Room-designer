import { useNavigate } from "react-router-dom";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <polyline points="9 21 9 12 15 12 15 21"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

export default function NotFoundPage() {
  const navigate = useNavigate();
  const suggestions = ["Living Room Ideas", "3D Rendering", "Pro Plans"];

  const handleDashboard = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) { navigate("/login"); return; }
      if (user.role === "designer" || user.role === "staff") {
        navigate("/designer/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (e) {
      navigate("/login");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f1f3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 24px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "1100px",
        gap: "60px",
      }}>

        {/* ── Left ── */}
        <div style={{ flex: "0 0 auto", maxWidth: "480px" }}>
          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(48px, 6vw, 76px)",
            fontWeight: "900",
            lineHeight: "1.1",
            margin: "0 0 6px 0",
            letterSpacing: "-1.5px",
            color: "#111827",
          }}>
            Oops! It
          </h1>
          <h1 style={{
            fontSize: "clamp(48px, 6vw, 76px)",
            fontWeight: "900",
            lineHeight: "1.1",
            margin: "0 0 28px 0",
            letterSpacing: "-1.5px",
            color: "#3b5bdb",
          }}>
            doesn't exist.
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "17px",
            color: "#6b7280",
            lineHeight: "1.65",
            margin: "0 0 36px 0",
            maxWidth: "400px",
          }}>
            It looks like the link is broken or the page has been moved. Let's get you back home or to your designs.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "44px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#3b5bdb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "15px 28px",
                fontSize: "15.5px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "-0.2px",
                transition: "background 0.2s, transform 0.1s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2f4cc4"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3b5bdb"}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onClick={() => navigate("/home")}
            >
              <HomeIcon /> Back to Home
            </button>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: "12px",
                padding: "15px 28px",
                fontSize: "15.5px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "-0.2px",
                transition: "background 0.2s, transform 0.1s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#d1d5db"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#e5e7eb"}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onClick={handleDashboard}
            >
              <DashboardIcon /> Go to Dashboard
            </button>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1.5px solid #e5e7eb", marginBottom: "22px" }} />

          {/* Search suggestions */}
          <p style={{
            fontSize: "11.5px",
            fontWeight: "700",
            color: "#9ca3af",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}>
            Try Searching For:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {suggestions.map(s => (
              <button
                key={s}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  fontSize: "14.5px",
                  color: "#374151",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: "500",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#3b5bdb"}
                onMouseLeave={e => e.currentTarget.style.color = "#374151"}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Image ── */}
        <div style={{
          flex: "0 0 auto",
          position: "relative",
          width: "clamp(320px, 42vw, 560px)",
        }}>
          <div style={{
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
            lineHeight: 0,
          }}>
            <img
              src="/404.png"
              alt="Empty room"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>

          {/* ERROR 404 badge */}
          <div style={{
            position: "absolute",
            bottom: "22px",
            right: "22px",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: "800",
            color: "#1e2a78",
            letterSpacing: "1.5px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}>
            ERROR 404
          </div>
        </div>

      </div>
    </div>
  );
}