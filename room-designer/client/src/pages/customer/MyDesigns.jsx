import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/common/Toast";
import LoggedInNavbar from "../../components/LoggedInNavbar";
import CustomerSidebar from "../../components/CustomerSidebar";
import { designAPI } from "../../services/designAPI";
import { furnitureItems } from "../../data/furnitureData";
import "../../styles/customer/MyDesigns.css";

export default function MyDesigns() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All Designs");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadDesigns = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated via auth context
        if (!isAuthenticated || !user || !user.id) {
          navigate("/login");
          return;
        }

        const res = await designAPI.getUserDesigns(user.id);
        setDesigns(res.designs || []);
        setError(null);
      } catch (err) {
        console.error("Error loading designs:", err);
        setError("Failed to load designs");
        showError("Failed to load designs");
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  const handleEditDesign = (design) => {
    // Enrich items with furniture library data
    const enrichedItems = (design.items || []).map((item) => {
      const furnitureData = furnitureItems.find((f) => f.id === item.id);
      return {
        ...furnitureData,
        ...item,
        model: item.model || furnitureData?.model,
        scale: item.scale || furnitureData?.scale,
        previewScale: item.previewScale || furnitureData?.previewScale,
      };
    });

    navigate("/room-editor", {
      state: {
        designId: design._id,
        config: { ...design, items: enrichedItems },
      },
    });
  };

  const handleDeleteDesign = async (designId) => {
    try {
      await designAPI.deleteDesign(designId);
      setDesigns((prev) => prev.filter((d) => d._id !== designId));
      success("Design deleted successfully");
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting design:", err);
      showError("Failed to delete design");
    }
  };

  const getFilteredDesigns = () => {
    let filtered = designs;

    if (activeTab === "Recent") {
      filtered = designs.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    }

    return filtered;
  };

  const tabs = ["All Designs", "Recent"];
  const tabIcons = {
    "All Designs": "⊞",
    "Recent": "🕐",
  };

  const filteredDesigns = getFilteredDesigns();

  return (
    <>
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Design</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this design? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDesign(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <LoggedInNavbar userRole="customer" />
      <div className="md-wrapper">
      <CustomerSidebar />
      <div className="md-frame">
        <div className="md-layout">
          {/* Main Content */}
          <main className="md-content">

            {/* Page Header */}
            <div className="md-page-header">
              <div>
                <h1 className="md-page-title">My Saved Designs</h1>
                <p className="md-page-sub">Manage, edit and share your interior design concepts.</p>
              </div>
              <button 
                className="md-create-btn"
                onClick={() => navigate("/room-wizard", { state: { from: "/customer/my-designs" } })}
              >
                + Create New Design
              </button>
            </div>

            {/* Tabs */}
            <div className="md-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`md-tab ${activeTab === tab ? "md-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="md-tab-icon">{tabIcons[tab]}</span>
                  {tab}
                  {tab === "All Designs" && <span className="md-tab-count">{designs.length}</span>}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
                <p>Loading your designs...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div style={{ 
                padding: "16px", 
                background: "#fee2e2", 
                color: "#991b1b", 
                borderRadius: "8px",
                marginBottom: "24px"
              }}>
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredDesigns.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f9f9f9",
                borderRadius: "12px",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📐</div>
                <h3 style={{ marginBottom: "8px" }}>No designs yet</h3>
                <p style={{ marginBottom: "24px", color: "#666" }}>
                  Create your first room design to get started
                </p>
                <button
                  className="md-create-btn"
                  onClick={() => navigate("/room-wizard", { state: { from: "/customer/my-designs" } })}
                >
                  + Create New Design
                </button>
              </div>
            )}

            {/* Designs Grid */}
            {!loading && filteredDesigns.length > 0 && (
              <>
                <div className="md-grid">
                  {filteredDesigns.map((design) => (
                    <div className="md-card" key={design._id}>
                      <div className="md-card-thumb">
                        <div style={{
                          width: "100%",
                          height: "100%",
                          background: `linear-gradient(135deg, ${design.colors?.wall || "#f5f5f3"} 0%, ${design.colors?.floorColor || "#5c3a29"} 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                        }}>
                          {design.roomType === "living-room" && "🛋️"}
                          {design.roomType === "bedroom" && "🛏️"}
                          {design.roomType === "kitchen" && "🍳"}
                          {design.roomType === "bathroom" && "🚿"}
                          {design.roomType === "home-office" && "💼"}
                          {design.roomType === "dining-room" && "🍽️"}
                        </div>
                        {design.status && (
                          <span className={`md-badge badge-${design.status}`}>
                            {design.status === "completed" ? "✓ COMPLETED" : "📝 DRAFT"}
                          </span>
                        )}
                        <button 
                          className="md-card-menu"
                          onClick={() => setDeleteConfirm(design._id)}
                          style={{ color: "#ef4444" }}
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="md-card-info">
                        <div className="md-card-title">{design.projectName || "Untitled Design"}</div>
                        <div className="md-card-meta">
                          {new Date(design.updatedAt).toLocaleDateString()} • <span className="md-card-cat">
                            {design.roomType.replace(/-/g, " ").toUpperCase()}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px" }}>
                          <button
                            onClick={() => handleEditDesign(design)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              background: "#2f66e8",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "13px",
                            }}
                          >
                            Edit Design
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Create New Project Card */}
                  <div 
                    className="md-card md-card--new"
                    onClick={() => navigate("/room-wizard", { state: { from: "/customer/my-designs" } })}
                  >
                    <div className="md-card-new-inner">
                      <div className="md-new-icon">+</div>
                      <div className="md-new-label">Create New Project</div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
      </div>
    </>
  );
}


