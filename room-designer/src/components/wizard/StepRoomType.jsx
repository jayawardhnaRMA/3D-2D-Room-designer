import { roomTypes } from "../../data/roomOptions";

export default function StepRoomType({ value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "18px",
      }}
    >
      {roomTypes.map((item) => {
        const active = value === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              border: active ? "2px solid #2563eb" : "1px solid #dbe3ef",
              background: active ? "#eff6ff" : "#fff",
              borderRadius: "18px",
              padding: "30px 20px",
              cursor: "pointer",
              textAlign: "center",
              position: "relative",
            }}
          >
            {active && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </div>
            )}

            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#eef2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <img
                src={item.icon}
                alt={item.label}
                style={{
                  width: "34px",
                  height: "34px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                fontWeight: 800,
                fontSize: "18px",
                marginBottom: "4px",
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {item.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}