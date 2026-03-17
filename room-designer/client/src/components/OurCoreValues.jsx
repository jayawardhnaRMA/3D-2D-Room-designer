import React from "react";
import "../styles/CoreValues.css";
import { Lightbulb, CreditCard, BadgeCheck } from "lucide-react";

function OurCoreValues() {
  return (
    <section className="values-section">

      <div className="values-container">

        <h2 className="values-title">Our Core Values</h2>

        <p className="values-subtitle">
          The principles that guide every decision we make and every feature we build.
        </p>

        <div className="values-grid">

          {/* Innovation */}
          <div className="value-card">
            <div className="icon-box">
              <Lightbulb size={24} />
            </div>

            <h3>Innovation</h3>

            <p>
              We constantly explore the frontiers of AI and computer graphics to
              provide the most realistic visualization experience.
            </p>
          </div>

          {/* Accessibility */}
          <div className="value-card">
            <div className="icon-box">
              <CreditCard size={24} />
            </div>

            <h3>Accessibility</h3>

            <p>
              Professional design tools shouldn't be locked behind high prices
              or steep learning curves. We make design for everyone.
            </p>
          </div>

          {/* Quality */}
          <div className="value-card">
            <div className="icon-box">
              <BadgeCheck size={24} />
            </div>

            <h3>Quality</h3>

            <p>
              From the accuracy of our lighting models to the responsiveness of
              our interface, we never compromise on excellence.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default OurCoreValues;