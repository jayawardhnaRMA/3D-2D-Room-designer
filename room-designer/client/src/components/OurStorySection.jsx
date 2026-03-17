import React from "react";
import "../styles/AboutStory.css";

function OurStorySection() {
  return (
    <section className="story-section">
      <div className="story-container">

        <div className="story-header">
          <div className="story-line"></div>
          <h2>Our Story</h2>
        </div>

        <div className="story-text">

          <p>
            Founded in 2021, Roomio emerged from a simple observation: the tools used by
            professional interior designers were far too complex and expensive for the
            average homeowner. We believed that anyone with a vision for their home should
            be able to see it come to life before making a single purchase.
          </p>

          <p>
            What started as a small team of AI researchers and 3D artists in San Francisco
            has grown into a global platform. By leveraging generative AI and high-fidelity
            rendering, we've bridged the gap between imagination and reality, helping over
            500,000 users visualize their future living spaces.
          </p>

          <p>
            Our journey is fueled by a commitment to innovation and a passion for beautiful,
            functional design. We continue to push the boundaries of what's possible in
            web-based 3D visualization.
          </p>

        </div>

      </div>
    </section>
  );
}

export default OurStorySection;