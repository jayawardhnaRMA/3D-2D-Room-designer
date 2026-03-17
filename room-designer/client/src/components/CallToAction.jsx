import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CallToAction.css";

function CallToAction() {
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
          Ready to design your dream space?
        </h2>

        <p className="cta-desc">
          Join thousands of users who have transformed their homes using
          Roomio. Start your first design today for free.
        </p>

        <button className="cta-button" onClick={handleGetStarted}>
          Get Started for Free
        </button>

      </div>

    </section>
  );
}

export default CallToAction;