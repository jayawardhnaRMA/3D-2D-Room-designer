import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

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
const Star = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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
          padding: "11px 0", backgroundColor: "transparent", fontFamily: "inherit" }}
      />
      {rightEl}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
export default function Login() {
  useBodyReset();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab]       = useState("customer");
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep]     = useState(false);
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Prevent admin from logging in as customer
    if (email === "admin@roomio.com" && tab === "customer") {
      setError("Admin account can only log in as Designer (Staff). Please select the Designer tab.");
      return;
    }

    // Prevent non-admin users from logging in as designer
    if (tab === "designer" && email !== "admin@roomio.com") {
      setError("Only admin@roomio.com can log in as a designer.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password: pw,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Backend sets HTTP-only cookie automatically
        // Just set the user in auth context
        login(response.data.user);
        
        if (response.data.user.role === "designer") {
          navigate("/designer/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        backgroundImage: "url('/Right Side_ Background Image - login.png')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "180px 32px 28px", boxSizing: "border-box",
      }}>
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
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "20px", padding: "5px 13px", marginBottom: "16px",
            width: "fit-content",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#a5f3fc" }}/>
            <span style={{ color: "white", fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.5px" }}>
              Interior Design Platform
            </span>
          </div>
          <h1 style={{
            color: "white", fontSize: "clamp(24px, 2.6vw, 38px)",
            fontWeight: "900", lineHeight: "1.1", letterSpacing: "-0.8px", margin: "0 0 12px",
            textShadow: "0 2px 16px rgba(0,0,0,0.55)",
          }}>
            Visualize your<br />space in<br />stunning 3D.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "13.5px", lineHeight: "1.6", maxWidth: "280px", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}>
            Collaborate with expert designers and bring your vision to life with our pro suite.
          </p>
        </div>

        {/* Testimonial */}
        <div>
          <div style={{
            background: "rgba(0, 0, 0, 0.15)", backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "14px", padding: "14px 16px",
          }}>
            <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
              {[0,1,2,3,4].map(i => <Star key={i}/>)}
            </div>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", lineHeight: "1.6", fontStyle: "italic", margin: "0 0 10px" }}>
              "Roomio transformed our workflow. The visualization quality is truly unmatched."
            </p>
            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "12px", margin: 0 }}>
              — Julianne Moore, Senior Interior Architect
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, height: "100vh", backgroundColor: "#ffffff",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "28px 48px",
        position: "relative", overflow: "hidden", boxSizing: "border-box",
      }}>

        {/* Switch to signup */}
        <div style={{ position: "absolute", top: "24px", right: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13.5px", color: "#94a3b8" }}>New to Roomio?</span>
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "transparent", border: `1.5px solid #c7d2fe`,
              color: P, borderRadius: "8px", padding: "7px 18px",
              fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = P; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P; e.currentTarget.style.borderColor = "#c7d2fe"; }}
          >
            Get Started
          </button>
        </div>

        {/* Decorative blur */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: P }}/>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.2px", color: P, textTransform: "uppercase" }}>
              Secure Login
            </span>
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.7px", margin: "0 0 6px" }}>
            Welcome back
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: "0 0 24px" }}>
            Sign in to your Roomio account to continue.
          </p>

          {/* Role tabs */}
          <div style={{
            display: "flex", backgroundColor: "#f1f5f9",
            borderRadius: "9px", padding: "3px", marginBottom: "20px", gap: "2px",
          }}>
            {[["customer","Customer"],["designer","Designer (Staff)"]].map(([val, label]) => {
              const isDisabled = 
                (val === "designer" && email !== "admin@roomio.com") ||
                (val === "customer" && email === "admin@roomio.com");
              
              return (
                <button key={val} 
                  onClick={() => setTab(val)} 
                  disabled={isDisabled}
                  style={{
                    flex: 1, padding: "8px 10px", border: "none", borderRadius: "7px",
                    fontSize: "13px", fontWeight: "600", cursor: isDisabled ? "not-allowed" : "pointer", 
                    fontFamily: "inherit",
                    backgroundColor: tab === val ? "white" : "transparent",
                    color: isDisabled ? "#b0bec5" : (tab === val ? P : "#94a3b8"),
                    boxShadow: tab === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.18s",
                    opacity: isDisabled ? 0.6 : 1,
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
          {email === "admin@roomio.com" && (
            <div style={{
              fontSize: "12px", color: "#94a3b8", marginBottom: "16px", fontStyle: "italic",
            }}>
              Admin account: Designer login only.
            </div>
          )}
          {email && email !== "admin@roomio.com" && (
            <div style={{
              fontSize: "12px", color: "#94a3b8", marginBottom: "16px", fontStyle: "italic",
            }}>
              Designer login is reserved for administrators only.
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Email Address
            </label>
            <InputField icon={<MailIcon/>} placeholder="name@company.com" type="email"
              value={email} onChange={e => setEmail(e.target.value)}/>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Password</label>
              <button style={{ background: "none", border: "none", color: P, fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                Forgot password?
              </button>
            </div>
            <InputField icon={<LockIcon/>} placeholder="Enter your password"
              type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
              rightEl={
                <button onClick={() => setShowPw(p => !p)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
                  {showPw ? <EyeOffIcon/> : <EyeIcon/>}
                </button>
              }
            />
          </div>

          {/* Remember me */}
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "20px" }}>
            <input type="checkbox" id="keep" checked={keep} onChange={e => setKeep(e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: P, cursor: "pointer", flexShrink: 0 }}/>
            <label htmlFor="keep" style={{ fontSize: "13px", color: "#64748b" }}>Keep me logged in for 30 days</label>
          </div>

          {/* CTA */}
          <button
            onClick={handleLogin}
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
            {loading ? "Signing in..." : "Sign In"} <ArrowIcon/>
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

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "24px" }}>
            <button onClick={() => navigate("/terms-of-service")} style={{ background: "none", border: "none", color: "#b0bec5", fontSize: "12px", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
              Terms of Service
            </button>
            <button onClick={() => navigate("/privacy-policy")} style={{ background: "none", border: "none", color: "#b0bec5", fontSize: "12px", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
              Privacy Policy
            </button>
            <button style={{ background: "none", border: "none", color: "#b0bec5", fontSize: "12px", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
