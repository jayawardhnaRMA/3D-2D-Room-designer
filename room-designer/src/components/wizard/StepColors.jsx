import { floorColors, wallColors } from "../../data/roomOptions";

export default function StepColors({ value, onChange }) {
  const update = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const ColorSwatch = ({ color, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: "72px",
        height: "72px",
        borderRadius: "14px",
        border: active ? "3px solid #2563eb" : "1px solid #dbe3ef",
        background: color,
        cursor: "pointer",
      }}
    />
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <div
        style={{
          border: "1px solid #dbe3ef",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Wall Color</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          {wallColors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              active={value.wall === color}
              onClick={() => update("wall", color)}
            />
          ))}
        </div>

        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
          Custom Wall Color
        </label>
        <input
          type="text"
          value={value.wall}
          onChange={(e) => update("wall", e.target.value)}
          placeholder="#f5f5f3"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
          }}
        />
      </div>

      <div
        style={{
          border: "1px solid #dbe3ef",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Floor Material & Color</h3>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {["wood", "tile", "carpet"].map((material) => (
            <button
              key={material}
              onClick={() => update("floorMaterial", material)}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border:
                  value.floorMaterial === material
                    ? "2px solid #2563eb"
                    : "1px solid #dbe3ef",
                background:
                  value.floorMaterial === material ? "#eff6ff" : "#fff",
                cursor: "pointer",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {material}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {floorColors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              active={value.floorColor === color}
              onClick={() => update("floorColor", color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}