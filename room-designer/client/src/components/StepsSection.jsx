import React from "react";
import "../styles/StepsSection.css";

import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";
import step5 from "../assets/step5.png";

import {
  Ruler,
  LayoutGrid,
  CheckCircle,
  Download,
  Share2
} from "lucide-react";

function StepsSection() {
  return (
    <section className="steps-section">

      <div className="steps-container">

        {/* TITLE */}

        <div className="steps-header">
          <h2>Your Design Journey in 5 Simple Steps</h2>
          <div className="title-line"></div>
        </div>


        {/* STEP 1 */}

        <div className="step-row">

          <div className="step-left">

            <div className="step-number">1</div>

            <h3 className="step-title">Create Your Room</h3>

            <p className="step-desc">
              Begin by defining your space. Use our smart wizard to input specific
              dimensions, room types, and architectural shapes. Whether it's a
              standard rectangular bedroom or a complex open-plan loft, our
              wizard handles it all.
            </p>

            <div className="feature-row">

              <div className="feature-box">

                <Ruler className="feature-icon"/>

                <span>Exact Dimensions</span>

              </div>


              <div className="feature-box">

                <LayoutGrid className="feature-icon"/>

                <span>Room Presets</span>

              </div>

            </div>

          </div>

          <div className="step-image">
            <img src={step1} alt="step1"/>
          </div>

        </div>



        {/* STEP 2 */}

        <div className="step-row reverse">

          <div className="step-image">
            <img src={step2} alt="step2"/>
          </div>

          <div className="step-left">

            <div className="step-number">2</div>

            <h3 className="step-title">Design in 2D</h3>

            <p className="step-desc">
              Drag and drop items from our extensive furniture catalog.
              Use precision tools to arrange layouts with pixel-perfect accuracy.
              Access thousands of real-world items from top brands to find the
              perfect fit.
            </p>

            <ul className="bullet-list">

              <li>
                <CheckCircle className="bullet-icon"/>
                10,000+ Furniture Items
              </li>

              <li>
                <CheckCircle className="bullet-icon"/>
                Snap-to-Grid Precision
              </li>

              <li>
                <CheckCircle className="bullet-icon"/>
                Easy Drag & Drop Interface
              </li>

            </ul>

          </div>

        </div>



        {/* STEP 3 */}

        <div className="step-row">

          <div className="step-left">

            <div className="step-number">3</div>

            <h3 className="step-title">Visualize in 3D</h3>

            <p className="step-desc">
              Instantly switch from a flat 2D layout to a breathtaking 3D view.
              Experience your room from any angle with our high-fidelity
              rendering engine that brings textures and proportions to life.
            </p>

            <button className="step-link">Explore 3D Mode →</button>

          </div>

          <div className="step-image">
            <img src={step3} alt="step3"/>
          </div>

        </div>



        {/* STEP 4 */}

        <div className="step-row reverse">

          <div className="step-image">
            <img src={step4} alt="step4"/>
          </div>

          <div className="step-left">

            <div className="step-number">4</div>

            <h3 className="step-title">Customize & Refine</h3>

            <p className="step-desc">
              Swap materials on the fly and adjust lighting to see how your space
              looks at different times of the day. Change wall colors, floor
              textures, and fabric finishes with a single click.
            </p>

            <div className="tag-row">

              <span>Real-time Lighting</span>

              <span>Material Library</span>

              <span>Wall Finishes</span>

            </div>

          </div>

        </div>



        {/* STEP 5 */}

        <div className="step-row">

          <div className="step-left">

            <div className="step-number">5</div>

            <h3 className="step-title">Save & Share</h3>

            <p className="step-desc">
              Export your plans as high-resolution images or interactive links.
              Share your vision with interior designers, contractors, or clients
              to ensure everyone is on the same page.
            </p>


            <div className="export-buttons">

              <button className="export-btn">

                <Download className="export-icon"/>

                PDF Export

              </button>


              <button className="export-btn">

                <Share2 className="export-icon"/>

                Shareable Link

              </button>

            </div>

          </div>

          <div className="step-image">
            <img src={step5} alt="step5"/>
          </div>

        </div>


      </div>

    </section>
  );
}

export default StepsSection;