import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/HowItWorks.css";
import StepsSection from "../components/StepsSection";
import CallToAction from "../components/CallToAction";

import heroImage from "../assets/hero-image2.png";

function HowItWorks() {
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
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isTicking = false;

    const onScroll = () => {
      if (isTicking) return;
      isTicking = true;

      window.requestAnimationFrame(() => {
        const offset = window.scrollY || 0;
        const imageShift = Math.min(offset * 0.06, 18);
        const cardShift = Math.min(offset * 0.04, 12);

        document.documentElement.style.setProperty("--hiw-hero-image", `${imageShift}px`);
        document.documentElement.style.setProperty("--hiw-hero-card", `${cardShift}px`);
        isTicking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar />

      <section className="hiw-hero reveal reveal--zoom" data-reveal>
        <div className="hiw-container">

          {/* LEFT SIDE */}
          <div className="hiw-left">

            <div className="process-badge">
              Process Overview
            </div>

            <h1 className="hero-title">
              How Roomio <br /> Works
            </h1>

            <p className="hero-description">
              Turn your interior design ideas into reality with our intuitive
              visualization tools. From initial floor plans to high-fidelity
              3D renders in just minutes.
            </p>

            <div className="hero-buttons">

              {/* Primary Button */}
              <button className="primary-btn" onClick={handleStartDesigning}>
                Start Designing Now
              </button>


              {/* Watch Demo Button */}
              <button className="secondary-btn">

                <span className="demo-icon">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#0F172A"
                      strokeWidth="2"
                    />

                    <polygon
                      points="10,8 16,12 10,16"
                      fill="#0F172A"
                    />

                  </svg>

                </span>

                Watch Demo

              </button>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="hiw-right">

            {/* HERO IMAGE */}
            <img
              src={heroImage}
              alt="Room Preview"
              className="hero-image"
            />


            {/* OVERLAY CARD */}
            <div className="render-overlay">

              {/* ICON */}
              <div className="overlay-icon">

                <div className="icon-middle">

                  <div className="icon-inner">

                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#166534"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                  </div>

                </div>

              </div>


              {/* TEXT */}
              <div className="overlay-text">

                <span className="overlay-title">
                  Render Complete
                </span>

                <span className="overlay-sub">
                  4K High-Fidelity Output
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>
      <div className="reveal reveal--fade" data-reveal>
        <StepsSection />
      </div>
      <div className="reveal reveal--pop" data-reveal>
        <CallToAction />
      </div>
      <div className="reveal reveal--fade" data-reveal>
        <Footer />
      </div>
    </>
  );
}

export default HowItWorks;