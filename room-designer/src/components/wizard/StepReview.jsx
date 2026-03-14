import Card from "../common/Card";

export default function StepReview({ data }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <Card>
        <h3 style={{ marginTop: 0, marginBottom: 18 }}>Project Summary</h3>

        <div style={{ display: "grid", gap: "14px", fontSize: "18px" }}>
          <div><strong>Project Name:</strong> {data.projectName}</div>
          <div><strong>Room Type:</strong> {data.roomType}</div>
          <div>
            <strong>Dimensions:</strong> {data.dimensions.length} × {data.dimensions.width} × {data.dimensions.height} {data.dimensions.unit}
          </div>
          <div><strong>Shape:</strong> {data.shape}</div>
          <div><strong>Wall Color:</strong> {data.colors.wall}</div>
          <div><strong>Floor Material:</strong> {data.colors.floorMaterial}</div>
          <div><strong>Floor Color:</strong> {data.colors.floorColor}</div>
          <div><strong>Natural Light:</strong> {data.lighting.naturalLightDirection}</div>
          <div><strong>Time of Day:</strong> {data.lighting.timeOfDay}:00</div>
          <div><strong>Fixtures:</strong> {data.lighting.fixtures.join(", ") || "None"}</div>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Editor Ready</h3>
        <p style={{ color: "#64748b", lineHeight: 1.7 }}>
          The room setup is ready to open inside the editor.
        </p>
      </Card>
    </div>
  );
}