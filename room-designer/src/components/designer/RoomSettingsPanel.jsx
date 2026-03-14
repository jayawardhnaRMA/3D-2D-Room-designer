export default function RoomSettingsPanel({
  config,
  viewMode,
  setViewMode,
  rotationLocked,
  setRotationLocked,
  roomItems,
  onOpenCart,
  selectedRoomItem,
  onRotationChange,
  onRotateLeft,
  onRotateRight,
  onDeleteSelected,
}) {
  const { dimensions, colors } = config;

  const formatValue = (value) => `${value} ${dimensions.unit}`;
  const selectedRotationDeg = selectedRoomItem
    ? Math.round((selectedRoomItem.rotation[1] * 180) / Math.PI)
    : 0;

  const selectedX = selectedRoomItem
    ? Math.round(selectedRoomItem.position[0] * 100)
    : 0;

  const selectedY = selectedRoomItem
    ? Math.round(selectedRoomItem.position[2] * 100)
    : 0;

  return (
    <aside
      style={{
        width: 280,
        background: "#e8e1ca",
        borderLeft: "1px solid #ded5b7",
        padding: 16,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 22 }}>
        Room Settings
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Width</div>
        <div style={valueBoxStyle}>{formatValue(dimensions.width)}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Length</div>
        <div style={valueBoxStyle}>{formatValue(dimensions.length)}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Height</div>
        <div style={valueBoxStyle}>{formatValue(dimensions.height)}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
          Wall Color
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              border: "1px solid #8a7f5d",
              background: colors.wall,
            }}
          />
          <div style={{ fontSize: 14 }}>{colors.wall}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
          Floor Material
        </div>
        <div style={valueBoxStyle}>{colors.floorMaterial}</div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          View Mode
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid #bfb79f",
            borderRadius: 999,
            overflow: "hidden",
            background: "#efe8d4",
          }}
        >
          <button
            onClick={() => setViewMode("2d")}
            style={{
              height: 40,
              border: "none",
              background: viewMode === "2d" ? "#ffffff" : "transparent",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            2D Plan
          </button>
          <button
            onClick={() => setViewMode("3d")}
            style={{
              height: 40,
              border: "none",
              background: viewMode === "3d" ? "#ffffff" : "transparent",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            3D View
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          3D Rotation Lock
        </div>

        <button
          onClick={() => setRotationLocked((prev) => !prev)}
          style={{
            width: "100%",
            height: 40,
            border: "none",
            borderRadius: 10,
            background: "#ce7c38",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {rotationLocked ? "Locked" : "Unlocked"}
        </button>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          
        </div>

        <button
          onClick={onOpenCart}
          style={{
            width: "100%",
            height: 50,
            border: "none",
            borderRadius: 10,
            background: "#01860c",
            color: "#ffffff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Add Room Items to Cart ({roomItems.length})
        </button>
      </div>

      {selectedRoomItem && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
            Selected Item
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            {selectedRoomItem.name}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              Rotation (°)
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedRotationDeg}
              onChange={(e) => onRotationChange(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: 13, marginTop: 4 }}>{selectedRotationDeg}°</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                
              />
              <div>
               
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            <span>X: {selectedX}cm</span>
            <span>Y: {selectedY}cm</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <button
              onClick={onRotateLeft}
              style={actionBtnStyle}
            >
              Rotate Left
            </button>

            <button
              onClick={onRotateRight}
              style={actionBtnStyle}
            >
              Rotate Right
            </button>
          </div>

          <button
            onClick={onDeleteSelected}
            style={{
              width: "100%",
              height: 38,
              border: "none",
              borderRadius: 10,
              background: "#bf4d4a",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete Selected
          </button>
        </div>
      )}
    </aside>
  );
}

const valueBoxStyle = {
  height: 34,
  borderRadius: 10,
  background: "#f4f0e6",
  border: "1px solid #ddd5bf",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  color: "#463f35",
};

const actionBtnStyle = {
  height: 38,
  border: "none",
  borderRadius: 10,
  background: "#d9d0b7",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};