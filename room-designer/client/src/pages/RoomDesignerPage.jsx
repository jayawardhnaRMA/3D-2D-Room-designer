import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { furnitureItems } from "../data/furnitureData";
import { getPendingEditorConfig } from "../utils/storage";
import { designAPI } from "../services/designAPI";
import { useToast } from "../hooks/useToast";
import html2canvas from "html2canvas";
import Toast from "../components/common/Toast";
import FurnitureLibrary from "../components/designer/FurnitureLibrary";
import FurnitureModal from "../components/designer/FurnitureModal";
import RoomSettingsPanel from "../components/designer/RoomSettingsPanel";
import DesignerCanvas from "../components/designer/DesignerCanvas";
import Room2DPlan from "../components/designer/Room2DPlan";
import CartDrawer from "../components/designer/CartDrawer";
import logoIcon from "../assets/Icon.png";

function makeDefaultConfig() {
  return {
    roomType: "living-room",
    dimensions: {
      unit: "m",
      length: 4.5,
      width: 3.8,
      height: 2.4,
    },
    shape: "rectangle",
    colors: {
      wall: "#f5f5f3",
      floorMaterial: "wood",
      floorColor: "#5c3a29",
      ceilingColor: "#ffffff",
    },
    lighting: {
      naturalLightDirection: "south",
      timeOfDay: 14,
      fixtures: ["ceiling-light"],
    },
    projectName: "New Living Room Setup",
    items: [],
    status: "draft",
  };
}

export default function RoomDesignerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();
  const hasLoadedRef = useRef(false);
  const mainContentRef = useRef(null);
  const designerCanvasRef = useRef(null);

  const initialConfig =
    location.state?.config || getPendingEditorConfig() || makeDefaultConfig();

  const [config, setConfig] = useState(initialConfig);
  const [viewMode, setViewMode] = useState("3d");
  const [rotationLocked, setRotationLocked] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [designId, setDesignId] = useState(location.state?.designId || params?.designId || null);

  const [roomItems, setRoomItems] = useState(config.items || []);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Load existing design and enrich with furniture data - ONLY ON MOUNT
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Only load from API if designId exists and no config was passed via navigation
    if (designId && !location.state?.config) {
      designAPI
        .getDesign(designId)
        .then((res) => {
          if (res.design) {
            const loadedDesign = res.design;
            const enrichedItems = (loadedDesign.items || []).map((item) => {
              const furnitureData = furnitureItems.find((f) => f.id === item.id);
              return {
                ...furnitureData,
                ...item,
                model: item.model || furnitureData?.model,
                scale: item.scale || furnitureData?.scale,
                previewScale: item.previewScale || furnitureData?.previewScale,
              };
            });
            setConfig(loadedDesign);
            setRoomItems(enrichedItems);
          }
        })
        .catch((err) => {
          console.error("Failed to load design:", err);
        });
    }
  }, []);

  const filteredItems = useMemo(() => {
    return furnitureItems.filter((item) => {
      const matchesFilter = filter === "All" || item.category === filter;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const selectedRoomItem =
    roomItems.find((item) => item.instanceId === selectedItemId) || null;

  const addItemToRoom = (item) => {
    const index = roomItems.length;
    const width = config.dimensions.width;
    const length = config.dimensions.length;

    const col = index % 3;
    const row = Math.floor(index / 3);

    const startX = -width / 2 + 0.9;
    const startZ = -length / 2 + 0.9;

    const x = Math.min(startX + col * 1.2, width / 2 - 0.8);
    const z = Math.min(startZ + row * 1.2, length / 2 - 0.8);

    const newItem = {
      ...item,
      instanceId: `${item.id}-${Date.now()}-${Math.random()}`,
      position: [x, 0, z],
      rotation: [0, 0, 0],
      scale: item.scale || [1, 1, 1],
      color: "#b8c0ca",
    };

    setRoomItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.instanceId);
    setSelectedItem(null);
  };

  const updateRoomItemPosition = (instanceId, nextPosition) => {
    const maxX = config.dimensions.width / 2 - 0.35;
    const minX = -config.dimensions.width / 2 + 0.35;
    const maxZ = config.dimensions.length / 2 - 0.35;
    const minZ = -config.dimensions.length / 2 + 0.35;

    const clampedX = Math.max(minX, Math.min(maxX, nextPosition[0]));
    const clampedZ = Math.max(minZ, Math.min(maxZ, nextPosition[2]));

    setRoomItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, position: [clampedX, 0, clampedZ] }
          : item
      )
    );
  };

  const updateSelectedRotation = (degrees) => {
    if (!selectedItemId) return;

    const radians = (degrees * Math.PI) / 180;

    setRoomItems((prev) =>
      prev.map((item) =>
        item.instanceId === selectedItemId
          ? { ...item, rotation: [0, radians, 0] }
          : item
      )
    );
  };

  const rotateSelectedBy = (degreesDelta) => {
    if (!selectedItemId) return;

    setRoomItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== selectedItemId) return item;
        const currentDegrees = Math.round((item.rotation[1] * 180) / Math.PI);
        const nextDegrees = currentDegrees + degreesDelta;

        return {
          ...item,
          rotation: [0, (nextDegrees * Math.PI) / 180, 0],
        };
      })
    );
  };

  const deleteSelectedItem = () => {
    if (!selectedItemId) return;
    setRoomItems((prev) =>
      prev.filter((item) => item.instanceId !== selectedItemId)
    );
    setSelectedItemId(null);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      // Check if user is authenticated via auth context
      if (!isAuthenticated || !user || !user.id) {
        showError("User not authenticated");
        navigate("/login");
        return;
      }

      const designData = {
        ...config,
        items: roomItems,
        status: "draft",
      };

      if (designId) {
        // Update existing design
        await designAPI.updateDesign(designId, designData);
        success("Design updated successfully!");
      } else {
        // Create new design
        const res = await designAPI.createDesign(user.id, designData);
        setDesignId(res.design._id);
        success("Design saved successfully!");
      }

      // Redirect based on user role
      const redirectPath = user.role === "designer" 
        ? "/designer/portfolio" 
        : "/customer/my-designs";
      
      setTimeout(() => {
        navigate(redirectPath, { state: { from: location.state?.from } });
      }, 1500);
    } catch (error) {
      console.error("Error saving design:", error);
      showError("Failed to save design. Try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportAs = (format) => {
    if (format === "json") {
      const payload = {
        ...config,
        items: roomItems.map((item) => ({
          id: item.id,
          name: item.name,
          position: item.position,
          rotation: item.rotation,
        })),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `room-design-${config.projectName || "design"}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success("Design exported as JSON!");
    } else if (format === "jpg") {
      // Export based on current view mode
      setTimeout(async () => {
        try {
          let imageData;

          if (viewMode === "3d") {
            // For 3D view: Use the DesignerCanvas ref to capture WebGL canvas
            if (!designerCanvasRef.current || !designerCanvasRef.current.screenshot) {
              showError("3D view not ready. Please wait a moment and try again.");
              return;
            }

            // Call the screenshot function from DesignerCanvas
            designerCanvasRef.current.screenshot((data, error) => {
              if (error) {
                showError(`Failed to capture 3D view: ${error}`);
                return;
              }

              if (!data) {
                showError("3D canvas is empty. Please try again.");
                return;
              }

              // Download the image
              const link = document.createElement("a");
              link.href = data;
              link.download = `room-design-${config.projectName || "design"}.jpg`;
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              success("3D design exported as JPG!");
            });
            return;
          } else {
            // For 2D view: Use html2canvas to capture SVG
            const mainContent = mainContentRef.current;
            if (!mainContent) {
              showError("Cannot find 2D view to export. Please try again.");
              return;
            }

            const canvas = await html2canvas(mainContent, {
              backgroundColor: "#ffffff",
              scale: 2,
              logging: false,
              allowTaint: true,
              useCORS: true,
              maxWidth: 1920,
              maxHeight: 1080,
            });
            imageData = canvas.toDataURL("image/jpeg", 0.95);

            // Download the image
            const link = document.createElement("a");
            link.href = imageData;
            link.download = `room-design-${config.projectName || "design"}.jpg`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            success("2D design exported as JPG!");
          }
        } catch (error) {
          console.error("Export error:", error);
          showError("Failed to export as JPG. Please try again.");
        }
      }, 100);
    }
  };

  const handleGoToDashboard = async () => {
    const shouldSave = window.confirm("Save this design before leaving?");
    if (shouldSave) {
      await handleSaveProject();
    } else {
      // Auto-save as draft anyway
      try {
        setIsSaving(true);
        const designData = {
          ...config,
          items: roomItems,
          status: "draft",
        };

        if (designId) {
          await designAPI.updateDesign(designId, designData);
        } else {
          const res = await designAPI.createDesign(user.id, designData);
          setDesignId(res.design._id);
        }
      } catch {
        console.error("Auto-save failed");
      } finally {
        setIsSaving(false);
      }

      const redirectPath = user.role === "designer" 
        ? "/designer/dashboard" 
        : "/customer/dashboard";
      
      navigate(redirectPath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
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

      <div
        style={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "78px 1fr",
          background: "#edf0f3",
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr auto auto",
            alignItems: "center",
            background: "#fff",
            borderBottom: "1px solid #ececec",
            padding: "0 24px",
            gap: 24,
          }}
        >
          {/* Logo and Roomio Text on Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, textDecoration: "none" }} onClick={() => navigate("/")} role="button">
            <img src="/Logo 1.png" alt="Roomio Logo" style={{ height: 32, width: 32, objectFit: "contain" }} />
            <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Roomio</span>
          </div>

          {/* Project Name in Center */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#111827",
                textAlign: "center",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {config.projectName || "Room Design"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "1px solid #bfc4cd",
                borderRadius: 999,
                overflow: "hidden",
                width: 170,
                background: "#f4efe6",
              }}
            >
              <button
                onClick={() => setViewMode("2d")}
                style={{
                  height: 38,
                  border: "none",
                  background: viewMode === "2d" ? "#2563eb" : "transparent",
                  color: viewMode === "2d" ? "#fff" : "#111827",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                2D Plan
              </button>

              <button
                onClick={() => setViewMode("3d")}
                style={{
                  height: 38,
                  border: "none",
                  background: viewMode === "3d" ? "#2563eb" : "transparent",
                  color: viewMode === "3d" ? "#fff" : "#111827",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                3D View
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              onClick={handleGoToDashboard}
              title="Go back to dashboard"
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 10,
                border: "1px solid #d7dbe3",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ← Dashboard
            </button>

            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  const menu = e.currentTarget.nextElementSibling;
                  menu.style.display = menu.style.display === "none" ? "block" : "none";
                }}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid #d7dbe3",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Export ▼
              </button>
              <div
                style={{
                  display: "none",
                  position: "absolute",
                  top: "48px",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 50,
                  minWidth: "120px",
                }}
              >
                <button
                  onClick={() => {
                    handleExportAs("json");
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#f9f9f9"}
                  onMouseLeave={(e) => e.target.style.background = "#fff"}
                >
                  JSON
                </button>
                <button
                  onClick={() => {
                    handleExportAs("jpg");
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    borderTop: "1px solid #eee",
                    background: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#f9f9f9"}
                  onMouseLeave={(e) => e.target.style.background = "#fff"}
                >
                  JPG
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveProject}
              disabled={isSaving}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 10,
                border: "none",
                background: isSaving ? "#999" : "#2f66e8",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Saving..." : "Save Design"}
            </button>

            <button
              onClick={handleLogout}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 10,
                border: "1px solid #d7dbe3",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                color: "#dc2626",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "266px 1fr 280px",
            minHeight: 0,
          }}
        >
          <FurnitureLibrary
            items={filteredItems}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            onSelectItem={setSelectedItem}
          />

          <main
            ref={mainContentRef}
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              background: "#edf0f3",
            }}
          >
            {viewMode === "3d" ? (
              <DesignerCanvas
                config={config}
                roomItems={roomItems}
                rotationLocked={rotationLocked}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onMoveItem={updateRoomItemPosition}
                exportRef={designerCanvasRef}
              />
            ) : (
              <Room2DPlan
                config={config}
                roomItems={roomItems}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onMoveItem={updateRoomItemPosition}
              />
            )}
          </main>

          <RoomSettingsPanel
            config={config}
            viewMode={viewMode}
            setViewMode={setViewMode}
            rotationLocked={rotationLocked}
            setRotationLocked={setRotationLocked}
            roomItems={roomItems}
            onOpenCart={() => setCartOpen(true)}
            selectedRoomItem={selectedRoomItem}
            onRotationChange={updateSelectedRotation}
            onRotateLeft={() => rotateSelectedBy(-15)}
            onRotateRight={() => rotateSelectedBy(15)}
            onDeleteSelected={deleteSelectedItem}
          />
        </div>
      </div>

      <FurnitureModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToRoom={addItemToRoom}
      />

      <CartDrawer
        open={cartOpen}
        items={roomItems}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
