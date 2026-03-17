import React from "react";
import "../styles/Features.css";
import { LayoutGrid, Database, Timer } from "lucide-react";

function FeaturesSection() {
  return (
    <section className="features">

      <div className="features-container">

        {/* Section Heading */}
        <div className="features-header">

          <span className="features-label">
            POWERFUL ENGINE
          </span>

          <h2 className="features-title">
            Everything you need to create perfect spaces
          </h2>

          <p className="features-description">
            Our suite of tools makes interior design accessible to everyone,
            from homeowners to professional decorators.
          </p>

        </div>


        {/* Feature Cards */}
        <div className="features-grid">

          {/* Card 1 */}
          <div className="feature-card">

            <div className="feature-icon">
              <LayoutGrid size={22} />
            </div>

            <h3>2D/3D Editor</h3>

            <p>
              Switch between precision floor plans and immersive 3D views instantly.
              Drag and drop with pixel-perfect accuracy.
            </p>

          </div>


          {/* Card 2 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Database size={22} />
            </div>

            <h3>Furniture Library</h3>

            <p>
              Access thousands of real-world furniture models, materials,
              and textures from top global brands.
            </p>

          </div>


          {/* Card 3 */}
          <div className="feature-card">

            <div className="feature-icon">
              <Timer size={22} />
            </div>

            <h3>Real-time Rendering</h3>

            <p>
              See lighting and shadow changes immediately with our
              high-fidelity engine. Export 4K photorealistic images.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FeaturesSection;