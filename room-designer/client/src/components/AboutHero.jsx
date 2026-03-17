import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutHero.css";
import heroImage from "../assets/about-hero.png";   // your hero image

function AboutHero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
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
        const bgShift = Math.min(offset * 0.08, 24);
        const contentShift = Math.min(offset * 0.04, 12);

        document.documentElement.style.setProperty("--about-hero-bg", `${bgShift}px`);
        document.documentElement.style.setProperty("--about-hero-content", `${contentShift}px`);
        isTicking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="about-hero">

      {/* Background Image */}
      <img
        src={heroImage}
        alt="About Roomio"
        className="about-hero-image"
      />

      {/* Overlay */}
      <div className="about-hero-overlay"></div>

      {/* Content */}
      <div className="about-hero-content">

        <h1 className="about-title">
          About Roomio
        </h1>

        <p className="about-subtitle">
          Empowering everyone to design their dream spaces with AI-powered
           3D visualization.
        </p>

        <button className="about-btn" onClick={handleGetStarted}>
          Get Started
        </button>

      </div>

    </section>
  );
}

export default AboutHero;