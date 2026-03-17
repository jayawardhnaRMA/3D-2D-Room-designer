import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

import heroImage from "../assets/hero-image.png";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";

function Hero() {
  const navigate = useNavigate();

  const handleStartDesigning = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        navigate(userData.role === "designer" ? "/designer/dashboard" : "/customer/dashboard");
      } catch (e) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    let isTicking = false;

    const onScroll = () => {
      if (isTicking) return;
      isTicking = true;

      window.requestAnimationFrame(() => {
        const offset = window.scrollY || 0;
        const parallax = Math.min(offset * 0.12, 32);
        const parallaxBg = Math.min(offset * 0.08, 22);
        const parallaxText = Math.min(offset * 0.06, 16);

        document.documentElement.style.setProperty("--hero-parallax", `${parallax}px`);
        document.documentElement.style.setProperty("--hero-parallax-bg", `${parallaxBg}px`);
        document.documentElement.style.setProperty("--hero-parallax-text", `${parallaxText}px`);
        isTicking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">

        {/* LEFT SIDE - TEXT */}
        <div className="hero-left">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            V2.0 NOW LIVE
          </div>

          <h1 className="hero-title">
            Visualize Your <br />
            <span>Dream Room</span> in <br />
            Stunning 3D
          </h1>

          <p className="hero-text">
            Design, arrange, and render your living space with professional-grade
            tools right in your browser. Photorealistic results in minutes, no
            technical skills required.
          </p>

          <button className="hero-btn" onClick={handleStartDesigning}>
            Start Designing Free
          </button>

          <div className="hero-users">
            <div className="avatars">
              <img src={avatar1} alt="user1" />
              <img src={avatar2} alt="user2" />
              <img src={avatar3} alt="user3" />
            </div>

            <p>Joined by 50,000+ designers</p>
          </div>

        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="hero-right">

          {/* Decorative Blur */}
          <div className="hero-bg-circle hero-bg-1"></div>
          <div className="hero-bg-circle hero-bg-2"></div>

          {/* Image Card */}
          <div className="hero-image-card">

            <img src={heroImage} alt="room preview" />

            {/* LIVE RENDER BADGE */}
            <div className="render-badge">

              {/* Icon */}
              <div className="badge-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 2C6.48 2 2 5.94 2 10.8C2 14.1 4.7 16.8 8 16.8H9.2C9.75 16.8 10.2 17.25 10.2 17.8C10.2 19.02 11.18 20 12.4 20H13C18.52 20 23 16.06 23 11.2C23 6.34 18.52 2 12 2Z"/>
                  <circle cx="9" cy="9" r="1.2" fill="#2563EB"/>
                  <circle cx="12.5" cy="7.5" r="1.2" fill="#2563EB"/>
                </svg>
              </div>

              {/* Text */}
              <div className="render-text">
                <span>LIVE RENDER</span>
                <p>Modern Scandinavian</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;