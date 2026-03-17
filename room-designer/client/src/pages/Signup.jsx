import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Signup.css";

// ─── Body reset ───────────────────────────────────────────────────────────────
function useBodyReset() {
  useEffect(() => {
    const b = document.body;
    const prev = { margin: b.style.margin, padding: b.style.padding, overflow: b.style.overflow };
    b.style.margin = "0";
    b.style.padding = "0";
    b.style.overflow = "hidden";
    return () => { b.style.margin = prev.margin; b.style.padding = prev.padding; b.style.overflow = prev.overflow; };
  }, []);
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Tokens ───────────────────────────────────────────────────────────────────
const P  = "#4f46e5";
const PD = "#4338ca";

// ─── InputField ───────────────────────────────────────────────────────────────
function InputField({ icon, placeholder, type = "text", value, onChange, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center",
      border: `1.5px solid ${focused ? P : "#e2e8f0"}`,
      borderRadius: "9px", padding: "0 12px", gap: "9px",
      backgroundColor: focused ? "#fff" : "#f8fafc",
      boxShadow: focused ? `0 0 0 3px rgba(79,70,229,0.08)` : "none",
      transition: "all 0.18s",
    }}>
      {icon}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#0f172a",
          padding: "10px 0", backgroundColor: "transparent", fontFamily: "inherit" }}
      />
      {rightEl}
    </div>
  );
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export default function Signup() {
  useBodyReset();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !pw || !confirm) {
      setError("All fields are required");
      return;
    }

    if (pw !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (pw.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password: pw,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Backend sets HTTP-only cookie automatically
        // Just set the user in auth context
        login(response.data.user);
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const avatars = [
    "https://i.pravatar.cc/68?img=47",
    "https://i.pravatar.cc/68?img=32",
    "https://i.pravatar.cc/68?img=12",
    "https://i.pravatar.cc/68?img=25",
  ];

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif",
      margin: 0, padding: 0,
    }}>

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div style={{
        width: "46%", height: "100vh", flexShrink: 0,
        position: "relative", overflow: "hidden",
        backgroundImage: "url('/Right Side_ Background Image - create account.png')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "180px 32px 28px", boxSizing: "border-box",
      }}>
        {/* Subtle image blur */}
        <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", zIndex: 0 }}/>

        {/* Logo — navbar row */}
        <div
          onClick={() => navigate("/home")}
          role="button"
          style={{
            position: "absolute", top: "20px", left: "28px",
            display: "flex", alignItems: "center", gap: "10px",
            cursor: "pointer", zIndex: 2,
          }}
        >
          <img src="/Logo 1.png" alt="Roomio" style={{ width: "36px", height: "36px", objectFit: "contain" }}/>
          <span style={{ color: "white", fontSize: "18px", fontWeight: "800", letterSpacing: "-0.4px", textShadow: "0 1px 8px rgba(0,0,0,0.50)" }}>Roomio</span>
        </div>

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "20px", padding: "5px 13px", marginBottom: "16px", width: "fit-content",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#c4b5fd" }}/>
            <span style={{ color: "white", fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.5px" }}>
              Join 5,000+ Designers
            </span>
          </div>
          <h1 style={{
            color: "white", fontSize: "clamp(24px, 2.6vw, 38px)",
            fontWeight: "900", lineHeight: "1.1", letterSpacing: "-0.8px", margin: "0 0 12px",
            textShadow: "0 2px 16px rgba(0,0,0,0.55)",
          }}>
            Elevate Your<br />Design<br />Workflow
          </h1>
          <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "13.5px", lineHeight: "1.6", maxWidth: "280px", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}>
            Create photorealistic interior visualizations in seconds and impress every client.
          </p>
        </div>

        {/* Social proof */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            background: "rgba(0,0,0,0.40)", backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "14px", padding: "14px 18px",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{ display: "flex" }}>
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="user" style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: "2.5px solid rgba(255,255,255,0.70)",
                  marginLeft: i === 0 ? 0 : "-10px",
                  objectFit: "cover",
                  position: "relative", zIndex: avatars.length - i,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.30)",
                }}/>
              ))}
            </div>
            <div>
              <div style={{ color: "white", fontSize: "13px", fontWeight: "600", lineHeight: "1.3" }}>5,000+ designers</div>
              <div style={{ color: "rgba(255,255,255,0.50)", fontSize: "11.5px" }}>trust Roomio globally</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, height: "100vh", backgroundColor: "#ffffff",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "24px 48px",
        position: "relative", overflow: "hidden", boxSizing: "border-box",
      }}>

        {/* Switch to login */}
        <div style={{ position: "absolute", top: "24px", right: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13.5px", color: "#94a3b8" }}>Have an account?</span>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent", border: `1.5px solid #c7d2fe`,
              color: P, borderRadius: "8px", padding: "7px 18px",
              fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = P; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P; e.currentTarget.style.borderColor = "#c7d2fe"; }}
          >
            Sign In
          </button>
        </div>

        <div style={{
          position: "absolute", bottom: "-100px", left: "-100px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: P }}/>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.2px", color: P, textTransform: "uppercase" }}>
              Get Started Free
            </span>
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.7px", margin: "0 0 5px" }}>
            Create your account
          </h2>
          <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.55", margin: "0 0 20px" }}>
            Join Roomio and bring your interior visions to life.
          </p>

          {/* Fields */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>
              Full Name
            </label>
            <InputField icon={<UserIcon/>} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)}/>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>
              Email Address
            </label>
            <InputField icon={<MailIcon/>} placeholder="name@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>
                Password
              </label>
              <InputField icon={<LockIcon/>} placeholder="Create password"
                type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
                rightEl={
                  <button onClick={() => setShowPw(p => !p)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
                    {showPw ? <EyeOffIcon/> : <EyeIcon/>}
                  </button>
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>
                Confirm Password
              </label>
              <InputField icon={<LockIcon/>} placeholder="Re-enter" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}/>
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "18px" }}>
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: P, cursor: "pointer", flexShrink: 0, marginTop: "2px" }}/>
            <label htmlFor="agree" style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.5" }}>
              I agree to the{" "}
              <button onClick={() => navigate("/terms-of-service")} style={{ background: "none", border: "none", color: P, fontWeight: "600", cursor: "pointer", padding: 0, fontSize: "12.5px", fontFamily: "inherit" }}>
                Terms & Conditions
              </button>
              {" "}and{" "}
              <button onClick={() => navigate("/privacy-policy")} style={{ background: "none", border: "none", color: P, fontWeight: "600", cursor: "pointer", padding: 0, fontSize: "12.5px", fontFamily: "inherit" }}>
                Privacy Policy
              </button>
            </label>
          </div>

          {/* CTA */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: "100%", background: loading ? "#b0bec5" : `linear-gradient(135deg, ${P} 0%, ${PD} 100%)`,
              color: "white", border: "none", borderRadius: "10px", padding: "13px",
              fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
              transition: "all 0.18s", fontFamily: "inherit", letterSpacing: "-0.1px",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 7px 20px rgba(79,70,229,0.45)"; } }}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.35)"; } }}
          >
            {loading ? "Creating Account..." : "Create Account"} <ArrowIcon/>
          </button>

          {error && (
            <div style={{
              marginTop: "16px", padding: "12px", backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5", borderRadius: "8px",
              color: "#991b1b", fontSize: "13px",
            }}>
              {error}
            </div>
          )}

          {/* Trust badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px" }}>
            <ShieldIcon/>
            <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>Your data is secured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
