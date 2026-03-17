import React from "react";
import "../styles/ContactHero.css";

function ContactHero() {
  return (
    <section className="contact-hero">

      <div className="hero-container">

        {/* Support Center Badge */}
        <div className="support-badge">
          Support Center
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          We're here to help you <br /> design better.
        </h1>

        {/* Description */}
        <p className="hero-description">
          Have a question about our interior visualization tools? Our team is ready to
          assist you with technical support or custom enterprise solutions.
        </p>

      </div>

    </section>
  );
}

export default ContactHero;