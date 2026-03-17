import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { Twitter, Instagram, Facebook, Mail, MapPin } from "lucide-react";
const logoSrc = "/Logo 1.png";
function Footer() {
  return (
    <footer className="footer-dark">
      <div className="footer-top">
        <div className="footer-container">
          {/* Brand */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-box">
                <img src={logoSrc} alt="Roomio Logo" />
              </div>
              <span className="logo-text">Roomio</span>
            </Link>
            <p className="footer-slogan">
              The world's most intuitive room visualization tool for homeowners and professionals alike. Design your future, one room at a time.
            </p>
            <div className="social-icons">
              <a href="/" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="/" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="/" aria-label="Facebook"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-list">
              <li><Link to="/how-it-works">How it Works</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/inspiration">Inspiration</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-list">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-container-bar">
          <p>&copy; {new Date().getFullYear()} Roomio Inc. All rights reserved.</p>
          <div className="bottom-meta-links">
            <span className="meta-info"><MapPin size={14} /> New York, NY</span>
            <span className="meta-info"><Mail size={14} /> hello@roomio.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
