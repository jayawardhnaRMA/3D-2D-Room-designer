import React from "react";
import "../styles/ContactContainer.css";
import { Mail, HelpCircle, MapPin } from "lucide-react";

function ContactContainer() {
  return (
    <section className="contact-section">

      <div className="contact-container">

        {/* LEFT SIDE - FORM */}
        <div className="contact-form-card">

          <div className="form-title">
            <Mail size={20} className="icon-blue"/>
            <h3>Send us a message</h3>
          </div>

          {/* Name + Email */}
          <div className="form-row">

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Jane Doe"/>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="jane@company.com"/>
            </div>

          </div>

          {/* Subject */}
          <div className="form-group">
            <label>Subject</label>
            <select>
              <option>Technical Support</option>
            </select>
          </div>

          {/* Message */}
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Tell us how we can help..."></textarea>
          </div>

          <button className="send-btn">Send Message</button>

        </div>


        {/* RIGHT SIDE */}
        <div className="contact-info">

          <div className="info-cards">

            <div className="info-card">
              <Mail size={20} className="icon-blue"/>
              <h4>Email Support</h4>
              <p>Response within 24h</p>
              <span className="link">support@roomio.com</span>
            </div>

            <div className="info-card">
              <HelpCircle size={20} className="icon-blue"/>
              <h4>Help Center</h4>
              <p>Self-service guides</p>
              <span className="link">Browse Docs →</span>
            </div>

          </div>

          <div className="map-box">
            <MapPin size={26} className="icon-blue"/>
            <p>Our Headquarters</p>
            <span>123 Design District, SF</span>
          </div>

          <div className="address">
            <MapPin size={16} className="icon-blue"/>
            <div>
              <h5>Physical Address</h5>
              <p>
                Roomio Inc.<br/>
                789 Innovation Way, Suite 400<br/>
                San Francisco, CA 94103
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default ContactContainer;