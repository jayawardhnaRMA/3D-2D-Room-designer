import { roomShapes } from "../../data/roomOptions";

export default function StepShape({ value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px",
      }}
    >
      {roomShapes.map((shape) => {
        const active = value === shape.id;

        return (
          <button
            key={shape.id}
            onClick={() => onChange(shape.id)}
            style={{
              border: active ? "2px solid #2563eb" : "1px solid #dbe3ef",
              background: active ? "#eff6ff" : "#fff",
              borderRadius: "18px",
              padding: "32px 20px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: 10 }}>
              {shape.label}
            </div>
            <div style={{ color: "#64748b" }}>{shape.subtitle}</div>
          </button>
        );
      })}
    </div>
  );
}