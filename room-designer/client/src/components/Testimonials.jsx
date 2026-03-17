import React from "react";
import "../styles/Testimonials.css";

import avatar4 from "../assets/avatar4.jpg";
import avatar5 from "../assets/avatar5.jpg";
import avatar6 from "../assets/avatar6.jpg";

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-container">

        <h2 className="testimonials-title">
          What designers are saying
        </h2>

        <div className="testimonials-grid">

          {/* Card 1 */}
          <div className="testimonial-card">

            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" className="star">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 
                  2 9.24 7.46 13.97 5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="testimonial-text">
              "The real-time rendering is a game changer. I can show clients exactly
              how their space will look with different lighting in seconds."
            </p>

            <div className="testimonial-author">
              <img src={avatar4} alt="Sarah Jenkins" />
              <div className="author-info">
                <span className="author-name">Sarah Jenkins</span>
                <span className="author-role">Interior Designer</span>
              </div>
            </div>

          </div>


          {/* Card 2 */}
          <div className="testimonial-card">

            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" className="star">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 
                  2 9.24 7.46 13.97 5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="testimonial-text">
              "The furniture library is massive. I found almost every piece of
              furniture I wanted to buy from actual retailers. Highly recommended!"
            </p>

            <div className="testimonial-author">
              <img src={avatar5} alt="Michael Chen" />
              <div className="author-info">
                <span className="author-name">Michael Chen</span>
                <span className="author-role">Homeowner</span>
              </div>
            </div>

          </div>


          {/* Card 3 */}
          <div className="testimonial-card">

            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" className="star">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 
                  2 9.24 7.46 13.97 5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="testimonial-text">
              "Best visualization app I've used. The interface is intuitive and
              the export quality is professional-grade. My clients love it."
            </p>

            <div className="testimonial-author">
              <img src={avatar6} alt="Elena Rodriguez" />
              <div className="author-info">
                <span className="author-name">Elena Rodriguez</span>
                <span className="author-role">Real Estate Agent</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Testimonials;