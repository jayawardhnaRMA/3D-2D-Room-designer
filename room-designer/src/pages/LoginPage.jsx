import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(22,163,74,0.18))",
          color: "#fff",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "30px", fontWeight: 800, marginBottom: 28 }}>
          RoomViz Pro
        </div>
        <h1 style={{ fontSize: "72px", lineHeight: 1.05, margin: 0 }}>
          Visualize your space in stunning 3D.
        </h1>
        <p style={{ marginTop: 24, fontSize: "24px", color: "#cbd5e1", maxWidth: 420 }}>
          Manage your room designs and bring your vision to life.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#fff",
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            padding: "36px",
            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "46px", marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            Please enter your details to sign in.
          </p>

          <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
            Email Address
          </label>
          <input
            type="email"
            defaultValue="name@company.com"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              marginBottom: 18,
            }}
          />

          <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
            Password
          </label>
          <input
            type="password"
            defaultValue="12345678"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              marginBottom: 24,
            }}
          />

          <PrimaryButton type="submit" fullWidth>
            Login to Dashboard
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}