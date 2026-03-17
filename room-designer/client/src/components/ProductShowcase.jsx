import React from "react";
import "../styles/ProductShowcase.css";
import preview from "../assets/image.png"; 

function ProductShowcase() {
  return (
    <section className="product-showcase">

      <div className="showcase-container">

        {/* LEFT CONTENT */}
        <div className="showcase-left">

          <h2>
            Design like a pro,<br/>
            without the learning<br/>
            curve.
          </h2>

          <p className="showcase-desc">
            Our AI-assisted layout engine suggests furniture placements
            based on architectural standards and your personal style
            preferences.
          </p>

          <ul className="feature-list">
            <li>Smart lighting automation</li>
            <li>AR mobile preview mode</li>
            <li>Multi-user collaboration</li>
          </ul>

        </div>

        {/* RIGHT IMAGE */}
        <div className="showcase-right">
          <img src={preview} alt="3D room preview"/>
        </div>

      </div>

    </section>
  );
}

export default ProductShowcase;