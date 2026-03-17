import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, Edit, Trash2, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import LoggedInNavbar from '../../components/LoggedInNavbar';
import Sidebar from '../../components/DesignerSidebar';
import { designAPI } from '../../services/designAPI';
import { furnitureItems } from '../../data/furnitureData';

const Portfolio = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toasts, removeToast, success, error: showError, warning } = useToast();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL PROJECTS');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const hasLoadedRef = useRef(false);

  const filterTabs = ['ALL PROJECTS', 'RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY'];

  useEffect(() => {
    // Only load designs once on mount
    if (hasLoadedRef.current) return;

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

    hasLoadedRef.current = true;
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

  const handleNewProject = () => {
    navigate("/room-wizard", { state: { from: "/designer/portfolio" } });
  };

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

      <LoggedInNavbar userRole="designer" />
      <div className="des-wrapper">
        <Sidebar />
        <div className="des-frame">
          <div className="des-layout">
            <main className="des-content">
              <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Page Title & New Project Button */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
                    <p className="text-gray-600">Manage and showcase professional interior designs.</p>
                  </div>
                  <button
                    onClick={handleNewProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <Plus size={18} />
                    New Project
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-6 mb-8 border-b border-gray-200">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`pb-3 text-sm font-semibold transition-colors relative ${
                        activeFilter === tab
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                      {activeFilter === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Loading State */}
                {loading && (
                  <div style={{ padding: "60px 20px", textAlign: "center", color: "#666" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
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
                {!loading && designs.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "#f9f9f9",
                    borderRadius: "12px",
                  }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📐</div>
                    <h3 style={{ marginBottom: "8px" }}>No designs yet</h3>
                    <p style={{ marginBottom: "24px", color: "#666" }}>
                      Create your first project design to showcase your work
                    </p>
                    <button
                      onClick={handleNewProject}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors mx-auto"
                    >
                      <Plus size={18} />
                      Create New Project
                    </button>
                  </div>
                )}

                {/* Projects Grid */}
                {!loading && (
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {designs.map((design) => (
                      <div key={design._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Design Thumbnail */}
                        <div
                          className="relative h-48 overflow-hidden group flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${design.colors?.wall || "#f5f5f3"} 0%, ${design.colors?.floorColor || "#5c3a29"} 100%)`
                          }}
                        >
                          <div style={{ fontSize: "64px" }}>
                            {design.roomType === "living-room" && "🛋️"}
                            {design.roomType === "bedroom" && "🛏️"}
                            {design.roomType === "kitchen" && "🍳"}
                            {design.roomType === "bathroom" && "🚿"}
                            {design.roomType === "home-office" && "💼"}
                            {design.roomType === "dining-room" && "🍽️"}
                          </div>
                          <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md">
                            <Heart size={18} className="text-gray-600" />
                          </button>
                        </div>

                        {/* Design Info */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {design.projectName || "Untitled Design"}
                          </h3>
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                            {design.roomType.replace(/-/g, " ")} PROJECT
                          </p>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <span>•</span>
                            <span>{design.items?.length || 0} items</span>
                            <span>•</span>
                            <span>{new Date(design.updatedAt).toLocaleDateString()}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDesign(design)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Edit size={16} className="text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">EDIT</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(design._id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} className="text-red-600" />
                              <span className="text-sm font-medium text-red-700">DELETE</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Create New Project Card */}
                    <div
                      onClick={handleNewProject}
                      className="bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 hover:border-blue-400 transition-colors cursor-pointer min-h-[380px]"
                    >
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Plus className="text-blue-600" size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Create New Project</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        Start a new visualization from template or scratch.
                      </p>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing 6 of 32 projects</p>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600">&lt;</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-sm">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      3
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600">&gt;</span>
                    </button>
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;