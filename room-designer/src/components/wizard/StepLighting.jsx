import { fixtureOptions } from "../../data/roomOptions";

export default function StepLighting({ value, onChange }) {
  const toggleFixture = (fixtureId) => {
    const exists = value.fixtures.includes(fixtureId);

    onChange({
      ...value,
      fixtures: exists
        ? value.fixtures.filter((f) => f !== fixtureId)
        : [...value.fixtures, fixtureId],
    });
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        style={{
          border: "1px solid #dbe3ef",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Natural Light Direction</h3>

        <select
          value={value.naturalLightDirection}
          onChange={(e) =>
            onChange({
              ...value,
              naturalLightDirection: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            marginBottom: 18,
          }}
        >
          <option value="east">East</option>
          <option value="south">South</option>
          <option value="west">West</option>
          <option value="north">North</option>
        </select>

        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
          Time of Day: {value.timeOfDay}:00
        </label>
        <input
          type="range"
          min="6"
          max="20"
          value={value.timeOfDay}
          onChange={(e) =>
            onChange({
              ...value,
              timeOfDay: Number(e.target.value),
            })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          border: "1px solid #dbe3ef",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Artificial Fixtures</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          {fixtureOptions.map((item) => {
            const active = value.fixtures.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => toggleFixture(item.id)}
                style={{
                  border: active ? "2px solid #2563eb" : "1px solid #dbe3ef",
                  background: active ? "#eff6ff" : "#fff",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}