import { useNavigate } from "react-router-dom";

export default function Sidebar({ active = "home" }) {
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: "240px",
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 22,
    fontWeight: 800,
    color: "#2563eb",}}>
                <img
    src="/logo/logo.png"
    alt="Roomio"
    style={{
      height: 28,
      width: 28,
      objectFit: "contain",
    }}
  />

            <span>Roomio</span>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "none",
            background: active === "home" ? "#dbeafe" : "transparent",
            color: active === "home" ? "#2563eb" : "#475569",
            fontWeight: 700,
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/my-designs")}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "none",
            background: active === "my-designs" ? "#dbeafe" : "transparent",
            color: active === "my-designs" ? "#2563eb" : "#475569",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          My Designs
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          border: "none",
          background: "transparent",
          color: "#ef4444",
          fontWeight: 700,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Logout
      </button>
    </aside>
  );
}