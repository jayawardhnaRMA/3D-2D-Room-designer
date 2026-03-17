import { useState } from "react";
import LoggedInNavbar from "../../components/LoggedInNavbar";
import CustomerSidebar from "../../components/CustomerSidebar";
import "../../styles/customer/Inspiration.css";
import sunDrenchedImg from "../../assets/Inspiraton/sun-drenched.png";
import brooklynLoftImg from "../../assets/Inspiraton/brooklyn-loft.png";
import contemporaryDiningImg from "../../assets/Inspiraton/contemporary-dining.png";
import nordicHideawayImg from "../../assets/Inspiraton/nordic-hideaway.png";

const inspirations = [
  {
    id: 1,
    title: "Sun-Drenched Living Space",
    type: "Professional Render",
    items: 48,
    style: "MODERN",
    styleClass: "style-modern",
    saved: false,
    img: sunDrenchedImg,
  },
  {
    id: 2,
    title: "Brooklyn Heights Loft",
    type: "Sourced Design",
    items: 32,
    style: "INDUSTRIAL",
    styleClass: "style-industrial",
    saved: false,
    img: brooklynLoftImg,
  },
  {
    id: 3,
    title: "Contemporary Dining",
    type: "Pro Visualization",
    items: 22,
    style: "MODERN",
    styleClass: "style-modern",
    saved: false,
    img: contemporaryDiningImg,
  },
  {
    id: 4,
    title: "Nordic Winter Hideaway",
    type: "Professional Render",
    items: 28,
    style: "SCANDINAVIAN",
    styleClass: "style-scandi",
    saved: true,
    img: nordicHideawayImg,
  },
];

const filters = ["All Styles", "Modern", "Industrial", "Minimalist", "Scandinavian"];

export default function Inspiration() {


  const [activeFilter, setActiveFilter] = useState("All Styles");
  const [savedItems, setSavedItems] = useState({ 4: true });

  const toggleSave = (id) => {
    setSavedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <LoggedInNavbar userRole="customer" />
      <div className="ins-wrapper">
      <CustomerSidebar />
      <div className="ins-frame">

        <div className="ins-layout">

          {/* Main Content */}
          <main className="ins-content">

            {/* Page Header */}
            <div className="ins-page-header">
              <div className="ins-header-text">
                <h1 className="ins-page-title">Inspiration</h1>
                <p className="ins-page-sub">
                  Explore professional room renders curated by our top designers. Discover the<br />
                  layouts and products that bring these spaces to life.
                </p>
              </div>
              <button className="ins-new-btn">⊕ New Project</button>
            </div>

            {/* Filter Bar */}
            <div className="ins-filter-bar">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`ins-filter-btn ${activeFilter === f ? "ins-filter-btn--active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === "All Styles" && activeFilter === "All Styles" && (
                    <span className="ins-grid-icon">⊞</span>
                  )}
                  {f}
                  {f !== "All Styles" && <span className="ins-chevron">∨</span>}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="ins-grid">
              {inspirations.map((item) => (
                <div className="ins-card" key={item.id}>
                  <div className="ins-card-thumb">
                    <img src={item.img} alt={item.title} />
                    <span className={`ins-style-badge ${item.styleClass}`}>{item.style}</span>
                    <button
                      className={`ins-heart-btn ${savedItems[item.id] ? "ins-heart-btn--saved" : ""}`}
                      onClick={() => toggleSave(item.id)}
                    >
                      {savedItems[item.id] ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="ins-card-body">
                    <div className="ins-card-title">{item.title}</div>
                    <div className="ins-card-meta">{item.type} • {item.items} items used</div>
                    <div className="ins-card-actions">
                      <button className="ins-see-btn">⊞ See Items Used</button>
                      <button className="ins-bookmark-btn">🔖</button> 
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="ins-load-more-section">
              <button className="ins-load-more-btn">Load More Inspiration</button>
              <p className="ins-showing">Showing 6 of 248 designs</p>
            </div>

          </main>
        </div>
      </div>
      </div>
    </>
  );
}




