import React from "react";
import "../styles/FAQPreview.css";

function FAQPreview() {
  return (
    <section className="faq-section">

      <div className="faq-container">

        <h2 className="faq-title">Common Questions</h2>
        <p className="faq-subtitle">
          Quick answers to frequently asked questions
        </p>

        <div className="faq-list">

          <div className="faq-card">
            <h3>Do you offer a free trial?</h3>
            <p>
              Yes! You can try RoomViz Pro with all premium features for 14 days without a credit card.
            </p>
          </div>

          <div className="faq-card">
            <h3>What file formats are supported?</h3>
            <p>
              We support OBJ, FBX, and GLB files for 3D models, and high-resolution JPEG/PNG for textures.
            </p>
          </div>

          <div className="faq-card">
            <h3>How do I upgrade my plan?</h3>
            <p>
              You can upgrade anytime via the 'Billing' tab in your dashboard. Changes take effect immediately.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default FAQPreview;