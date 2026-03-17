import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CTASection.css";

function CTASection() {
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
  return (
    <section className="cta-section">

      <div className="cta-container">

        <h2 className="cta-title">
          Ready to design your perfect space?
        </h2>

        <p className="cta-text">
          Join thousands of others creating beautiful rooms with Roomio.
          No credit card required to start.
        </p>

        <button className="cta-button" onClick={handleGetStarted}>
          Get Started For Free
        </button>

      </div>

    </section>
  );
}

export default CTASection;