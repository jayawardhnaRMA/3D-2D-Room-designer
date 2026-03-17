export default function StepProjectName({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          Project Name
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Modern Living Room, Cozy Bedroom"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            border: "1px solid #dbe3ef",
            borderRadius: "8px",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#2563eb";
            e.target.style.outline = "none";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#dbe3ef";
          }}
        />
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Give your project a meaningful name to help you identify it later.
        </p>
      </div>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          borderLeft: "4px solid #2563eb",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#374151",
            fontWeight: "500",
          }}
        >
          💡 Tip: Use descriptive names like "Guest Bedroom Makeover" or "Office Renovation" to make it easy to find your designs.
        </p>
      </div>
    </div>
  );
}
