import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import DesignCard from "../components/dashboard/DesignCard";
import Card from "../components/common/Card";
import {
  deleteDesign,
  getSavedDesigns,
  savePendingEditorConfig,
} from "../utils/storage";

export default function MyDesignsPage() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    setDesigns(getSavedDesigns());
  }, []);

  const refreshDesigns = () => {
    setDesigns(getSavedDesigns());
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
      <Sidebar active="my-designs" />

      <main style={{ padding: "0 32px 32px" }}>
        <Topbar />

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "46px", margin: "0 0 8px" }}>My Designs</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "18px" }}>
            All your saved room projects in one place.
          </p>
        </div>

        {designs.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onOpen={handleOpenDesign}
                onDelete={handleDeleteDesign}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div style={{ fontWeight: 700, fontSize: "22px", marginBottom: 10 }}>
              No saved designs
            </div>
            <div style={{ color: "#64748b" }}>
              Your saved projects will appear here.
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}