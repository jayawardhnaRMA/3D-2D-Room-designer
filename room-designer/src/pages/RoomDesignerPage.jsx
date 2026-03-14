import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { furnitureItems } from "../data/furnitureData";
import { getPendingEditorConfig, saveDesign } from "../utils/storage";
import FurnitureLibrary from "../components/designer/FurnitureLibrary";
import FurnitureModal from "../components/designer/FurnitureModal";
import RoomSettingsPanel from "../components/designer/RoomSettingsPanel";
import DesignerCanvas from "../components/designer/DesignerCanvas";
import Room2DPlan from "../components/designer/Room2DPlan";
import CartDrawer from "../components/designer/CartDrawer";

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
  };
}

export default function RoomDesignerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const config =
    location.state?.config || getPendingEditorConfig() || makeDefaultConfig();

  const [viewMode, setViewMode] = useState("3d");
  const [rotationLocked, setRotationLocked] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [roomItems, setRoomItems] = useState(config.items || []);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

  const handleSaveProject = () => {
    const saved = saveDesign({
      ...config,
      items: roomItems,
    });

    navigate("/dashboard", { state: { savedProjectId: saved.id } });
  };

  const handleExport = () => {
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
    a.download = "room-project.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
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
            gridTemplateColumns: "240px 1fr 220px",
            alignItems: "center",
            background: "#fff",
            borderBottom: "1px solid #ececec",
            padding: "0 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 800,
              fontSize: 18,
              color: "#2563eb",
            }}
          >
            <img
              src="/logo/logo.png"
              alt="Roomio"
              style={{
                height: 26,
                width: 26,
                objectFit: "contain",
              }}
            />
            <span>Roomio</span>
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
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              onClick={handleExport}
              style={{
                height: 40,
                padding: "0 18px",
                borderRadius: 10,
                border: "1px solid #d7dbe3",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Export
            </button>

            <button
              onClick={handleSaveProject}
              style={{
                height: 40,
                padding: "0 18px",
                borderRadius: 10,
                border: "none",
                background: "#2f66e8",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Save Project
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