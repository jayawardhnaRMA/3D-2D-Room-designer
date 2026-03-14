import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import DesignCard from "../components/dashboard/DesignCard";
import PrimaryButton from "../components/common/PrimaryButton";
import Card from "../components/common/Card";
import {
  deleteDesign,
  getSavedDesigns,
  savePendingEditorConfig,
} from "../utils/storage";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [projectName, setProjectName] = useState("New Living Room Setup");

  useEffect(() => {
    setDesigns(getSavedDesigns());
  }, []);

  const recentDesigns = designs.slice(0, 3);

  const refreshDesigns = () => {
    setDesigns(getSavedDesigns());
  };

  const handleCreateNewDesign = () => {
    const cleanName = projectName.trim() || "";
    navigate("/wizard", { state: { projectName: cleanName } });
  };

  const handleDeleteDesign = (designId) => {
    deleteDesign(designId);
    refreshDesigns();
  };

  const handleOpenDesign = (design) => {
    savePendingEditorConfig(design);
    navigate("/designer", { state: { config: design } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        background: "#f8fafc",
      }}
    >
      <Sidebar active="home" />

      <main style={{ padding: "0 32px 32px" }}>
        <Topbar />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
            gap: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: "52px", margin: "0 0 8px" }}>Hello, Alex!</h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "22px" }}>
              Welcome back to your workspace.
            </p>
          </div>

          <div
            style={{
              width: 360,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 8,
              }}
            >
              Project Name
            </div>

            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              style={{
                width: "100%",
                height: 42,
                borderRadius: 12,
                border: "1px solid #dbe3ef",
                padding: "0 14px",
                fontSize: 15,
                marginBottom: 12,
              }}
            />

            <PrimaryButton onClick={handleCreateNewDesign} fullWidth>
              + Create New Design
            </PrimaryButton>
          </div>
        </div>

        <div style={{ marginBottom: "28px", maxWidth: "320px" }}>
          <Card>
            <div style={{ color: "#64748b", marginBottom: 10 }}>Total Designs</div>
            <div style={{ fontSize: "44px", fontWeight: 800 }}>{designs.length}</div>
          </Card>
        </div>

        <h2 style={{ fontSize: "34px", marginBottom: 18 }}>Recent Designs</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
          }}
        >
          {recentDesigns.length > 0 ? (
            recentDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onOpen={handleOpenDesign}
                onDelete={handleDeleteDesign}
              />
            ))
          ) : (
            <Card>
              <div style={{ fontWeight: 700, fontSize: "22px", marginBottom: 10 }}>
                No projects yet
              </div>
              <div style={{ color: "#64748b", marginBottom: 18 }}>
                Add a project name and click Create New Design.
              </div>
              <PrimaryButton onClick={handleCreateNewDesign}>
                Start New Project
              </PrimaryButton>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}