import React, { useState, useEffect, useMemo } from "react";
import "../styles/PrivacyPolicy.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Info,
  Database,
  BarChart3,
  Shield,
  Share2,
  User,
  Image,
  Monitor
} from "lucide-react";

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const tocItems = useMemo(() => [
    { id: "introduction", label: "Introduction", icon: Info },
    { id: "information-collection", label: "Information Collection", icon: Database },
    { id: "data-usage", label: "Data Usage", icon: BarChart3 },
    { id: "data-security", label: "Data Security", icon: Shield },
    { id: "third-party-sharing", label: "Third-Party Sharing", icon: Share2 },
  ], []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top < 200) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);
  return (
    <>
      <Navbar />

      <main className="privacy-main">

        <div className="privacy-container">

          {/* LEFT SIDEBAR */}

          <aside className="privacy-sidebar">

            <div className="toc-card">

              <h3 className="toc-title">TABLE OF CONTENTS</h3>

              <nav className="toc-links">

                {tocItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`toc-link ${activeSection === item.id ? "active" : ""}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <IconComponent size={18} />
                      {item.label}
                    </button>
                  );
                })}

              </nav>
            </div>

            {/* HELP CARD */}

            <div className="help-card">

              <h4 className="help-title">Need help?</h4>

              <p>
                Questions about your data or privacy?<br />
                Our team is here to assist you.
              </p>

              <button className="contact-link">
                Contact Privacy Team
              </button>

            </div>

          </aside>


          {/* RIGHT CONTENT */}

          <article className="privacy-article">

            <p className="policy-label">PRIVACY POLICY</p>

            <h1 className="policy-title">Privacy Policy</h1>

            <p className="policy-date">
              Last Updated: March 11, 2026
            </p>


            {/* SECTION 1 */}

            <section className="policy-section" id="introduction">

              <h2>1. Introduction</h2>

              <p>
                At Roomio, we take your privacy seriously. This policy
                describes how we collect, use, and handle your personal
                information when you use our website, mobile application,
                and architectural visualization services.
              </p>

              <p>
                By using Roomio, you consent to the data practices
                described in this statement. If you do not agree with the
                terms of this privacy policy, please do not access the
                application.
              </p>

            </section>


            {/* SECTION 2 */}

            <section className="policy-section" id="information-collection">

              <h2>2. Information Collection</h2>

              <div className="info-box">

                <div className="info-item">
                  <User size={20} />
                  <div>
                    <h4>Personal Data</h4>
                    <p>
                      Name, email address, phone number, and account
                      credentials when you register for our services.
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <Image size={20} />
                  <div>
                    <h4>User Content</h4>
                    <p>
                      Photos, floor plans, and design preferences you upload
                      to create room visualizations.
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <Monitor size={20} />
                  <div>
                    <h4>Technical Data</h4>
                    <p>
                      IP address, browser type, device information,
                      and usage patterns collected via cookies.
                    </p>
                  </div>
                </div>

              </div>

            </section>


            {/* SECTION 3 */}

            <section className="policy-section" id="data-usage">

              <h2>3. Data Usage</h2>

              <ul className="usage-list">
                <li>To provide and maintain our visualization service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To gather analysis so we can improve our platform</li>
                <li>To monitor usage for security purposes</li>
              </ul>

            </section>


            {/* SECTION 4 */}

            <section className="policy-section" id="data-security">

              <h2>4. Data Security</h2>

              <p>
                The security of your data is important to us, but remember
                that no method of transmission over the Internet, or method
                of electronic storage is 100% secure.
              </p>

              <div className="security-grid">

                <div className="security-card">
                  <h4>Encryption</h4>
                  <p>
                    All data is encrypted in transit and at rest using
                    industry-standard protocols.
                  </p>
                </div>

                <div className="security-card">
                  <h4>Access Control</h4>
                  <p>
                    Strict internal policies limit employee access to
                    personal user data.
                  </p>
                </div>

              </div>

            </section>


            {/* SECTION 5 */}

            <section className="policy-section" id="third-party-sharing">

              <h2>5. Third-Party Sharing</h2>

              <p>
                We do not sell, trade, or otherwise transfer your
                personally identifiable information to outside parties
                except in the following cases:
              </p>

              <ul className="blue-list">

                <li>
                  Trusted service providers who assist us in operating
                  our website and conducting our business.
                </li>

                <li>
                  When we believe release is appropriate to comply
                  with the law or protect rights and safety.
                </li>

              </ul>

            </section>


            {/* FOOTER INFO */}

            <div className="policy-footer">

              <p>
                If you have any questions about this Privacy Policy,
                please contact us at:
              </p>

              <strong>Roomio Legal Department</strong>

              <p>
                123 Innovation Drive, Silicon Valley, CA 94025<br />
                legal@roomio.com
              </p>

            </div>

          </article>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;