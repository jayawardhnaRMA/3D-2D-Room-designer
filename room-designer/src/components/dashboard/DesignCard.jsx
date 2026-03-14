import Card from "../common/Card";

export default function DesignCard({ design, onOpen, onDelete }) {
  return (
    <Card
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "170px",
          background:
            "linear-gradient(135deg, rgba(125,211,252,0.6), rgba(134,239,172,0.5))",
        }}
      />

      <div style={{ padding: "18px" }}>
        <div style={{ fontWeight: 800, fontSize: "22px", marginBottom: 10 }}>
          {design.projectName}
        </div>

        <div style={{ color: "#64748b", marginBottom: 6 }}>
          Type: {design.roomType}
        </div>

        <div style={{ color: "#64748b", marginBottom: 16 }}>
          {design.dimensions.length} × {design.dimensions.width} ×{" "}
          {design.dimensions.height} {design.dimensions.unit}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={() => onOpen(design)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: "none",
              background: "#2f66e8",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open
          </button>

          <button
            onClick={() => onDelete(design.id)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#c24141",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}