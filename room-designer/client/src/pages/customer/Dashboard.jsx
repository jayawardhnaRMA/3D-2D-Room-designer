import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInNavbar from "../../components/LoggedInNavbar";
import CustomerSidebar from "../../components/CustomerSidebar";
import { designAPI } from "../../services/designAPI";
import "../../styles/customer/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        const firstName = userData.name ? userData.name.split(" ")[0] : "User";
        setUserName(firstName);
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadDesigns = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.id) {
          const response = await designAPI.getUserDesigns(user.id);
          setDesigns(response.designs || []);
        }
      } catch (error) {
        console.error("Error loading designs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  const handleCreateDesign = () => {
    navigate("/room-wizard", { state: { from: "/customer/dashboard" } });
  };

  return (
    <>
      <LoggedInNavbar userRole="customer" />
      <div className="app-wrapper">
        <CustomerSidebar />
        <div className="app-frame">
        <div className="main-layout">

          {/* Main Content */}
          <main className="content">
            <div className="content-header">
              <div>
                <h1 className="greeting">Hello, {userName}!</h1>
                <p className="subgreeting">Welcome back to your workspace. What are we designing today?</p>
              </div>
              <button className="create-btn" onClick={handleCreateDesign}>＋ Create New Design</button>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon stat-icon--blue">🖥️</div>
                <div>
                  <div className="stat-label">Total Designs</div>
                  <div className="stat-value">{designs.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon--green">📋</div>
                <div>
                  <div className="stat-label">Active Projects</div>
                  <div className="stat-value">{designs.filter(d => d.status === 'draft').length}</div>
                </div>
              </div>
            </div>

            {/* Recent Designs */}
            <div className="section-header">
              <h2 className="section-title">Recent Designs</h2>
              <button className="view-all">View All</button>
            </div>

            <div className="designs-grid">
              {designs.length > 0 ? (
                designs.slice(0, 4).map((design) => (
                  <div 
                    className="design-card" 
                    key={design._id}
                    onClick={() => navigate(`/room-editor?designId=${design._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="design-thumb">
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '48px'
                      }}>
                        {design.roomType === 'bedroom' ? '🛏️' : 
                         design.roomType === 'kitchen' ? '🍳' :
                         design.roomType === 'living-room' ? '🛋️' :
                         design.roomType === 'office' ? '💼' : '🏠'}
                      </div>
                      <span className={`design-badge ${design.status === 'draft' ? 'badge-draft' : 'badge-render'}`}>
                        {design.status === 'draft' ? 'DRAFT' : 'SAVED'}
                      </span>
                    </div>
                    <div className="design-info">
                      <div className="design-title">{design.projectName || 'Untitled Design'}</div>
                      <div className="design-updated">
                        🕐 {design.updatedAt ? new Date(design.updatedAt).toLocaleDateString() : 'Recently created'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#999', fontSize: '16px' }}>No designs yet. Create your first design!</p>
                </div>
              )}
            </div>

            {/* CTA Banner */}
            <div className="cta-banner">
              <div className="cta-icon">⊞</div>
              <h3 className="cta-title">Ready to design a new space?</h3>
              <p className="cta-sub">Upload a photo of your room or start with a blank template<br />to begin your visualization journey.</p>
              <button className="cta-btn" onClick={handleCreateDesign}>Start Blank Design</button>
            </div>
          </main>
        </div>
      </div>
      </div>
    </>
  );
}


