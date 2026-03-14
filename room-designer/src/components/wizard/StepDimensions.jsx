import { useMemo, useState } from "react";

export default function StepDimensions({ value, onChange }) {
  const [previewMode, setPreviewMode] = useState("3d");

  const update = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: field === "unit" ? fieldValue : Number(fieldValue),
    });
  };

  const unitLabel = value.unit === "m" ? "m" : "ft";

  const previewValues = useMemo(() => {
    const safeLength = Number(value.length) || 0;
    const safeWidth = Number(value.width) || 0;
    const safeHeight = Number(value.height) || 0;

    return {
      length: safeLength,
      width: safeWidth,
      height: safeHeight,
    };
  }, [value.length, value.width, value.height]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <div
        style={{
          border: "1px solid #dbe3ef",
          borderRadius: "18px",
          padding: "24px",
          background: "#fff",
        }}
      >
        <div style={{ marginBottom: 18, fontWeight: 700 }}>Measurement Unit</div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["m", "ft"].map((unit) => (
            <button
              key={unit}
              onClick={() => update("unit", unit)}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border:
                  value.unit === unit
                    ? "2px solid #2563eb"
                    : "1px solid #dbe3ef",
                background: value.unit === unit ? "#eff6ff" : "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {unit === "m" ? "Meters" : "Feet"}
            </button>
          ))}
        </div>

        {["length", "width", "height"].map((field) => (
          <div key={field} style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 700,
                textTransform: "capitalize",
                color: "#334155",
              }}
            >
              {field}
            </label>

            <div style={{ position: "relative" }}>
              <input
                type="number"
                step="0.1"
                min="0"
                value={value[field]}
                onChange={(e) => update(field, e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 46px 14px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "18px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontWeight: 700,
                }}
              >
                {unitLabel}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: "18px",
          minHeight: "390px",
          background: "#04173d",
          color: "#60a5fa",
          border: "1px solid #1e293b",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button
            onClick={() => setPreviewMode("3d")}
            style={{
              background: previewMode === "3d" ? "#1e335b" : "transparent",
              color: "#fff",
              padding: "9px 14px",
              borderRadius: "999px",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            3D View
          </button>

          <button
            onClick={() => setPreviewMode("2d")}
            style={{
              background: previewMode === "2d" ? "#1e335b" : "transparent",
              color: "#d7e4ff",
              padding: "9px 14px",
              borderRadius: "999px",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            2D Plan
          </button>
        </div>

        <div
          style={{
            flex: 1,
            borderRadius: "14px",
            overflow: "hidden",
            background: "#061b47",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {previewMode === "3d" ? (
            <Dimension3DPreview
              length={previewValues.length}
              width={previewValues.width}
              height={previewValues.height}
              unit={unitLabel}
            />
          ) : (
            <Dimension2DPreview
              length={previewValues.length}
              width={previewValues.width}
              unit={unitLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Dimension3DPreview({ length, width, height, unit }) {
  const displayLength = `${length}${unit}`;
  const displayWidth = `${width}${unit}`;
  const displayHeight = `${height}${unit}`;

  return (
    <svg
      viewBox="0 0 420 320"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="420" height="320" fill="#061b47" />

      {/* Back wall */}
      <polygon
        points="135,72 318,72 318,200 135,200"
        fill="#14284f"
        stroke="#2b76ff"
        strokeWidth="2"
      />

      {/* Floor */}
      <polygon
        points="135,200 318,200 365,226 179,226"
        fill="#0b214b"
        stroke="#2b76ff"
        strokeWidth="2"
      />

      {/* Left wall */}
      <polygon
        points="135,72 179,95 179,226 135,200"
        fill="#112349"
        stroke="#2b76ff"
        strokeWidth="2"
      />

      {/* Right wall */}
      <polygon
        points="318,72 365,96 365,226 318,200"
        fill="#0d2044"
        stroke="#2b76ff"
        strokeWidth="2"
      />

      {/* height guide lines */}
      <line x1="126" y1="56" x2="126" y2="215" stroke="#4c91ff" strokeWidth="1.5" />
      <line x1="373" y1="78" x2="373" y2="238" stroke="#4c91ff" strokeWidth="1.5" />

      {/* length text */}
      <text
        x="198"
        y="214"
        fill="#46a0ff"
        fontSize="12"
        fontWeight="700"
      >
        LENGTH: {displayLength}
      </text>

      {/* width text */}
      <text
        x="284"
        y="210"
        fill="#46a0ff"
        fontSize="12"
        fontWeight="700"
      >
        WIDTH: {displayWidth}
      </text>

      {/* height text */}
      <text
        x="78"
        y="142"
        fill="#46a0ff"
        fontSize="12"
        fontWeight="700"
        transform="rotate(-90 78 142)"
      >
        HEIGHT: {displayHeight}
      </text>

      <text
        x="210"
        y="286"
        textAnchor="middle"
        fill="#93a8d4"
        fontSize="12"
        letterSpacing="1"
      >
        LIVE DIMENSION PREVIEW
      </text>
    </svg>
  );
}

function Dimension2DPreview({ length, width, unit }) {
  const displayLength = `${length}${unit}`;
  const displayWidth = `${width}${unit}`;

  return (
    <svg
      viewBox="0 0 420 320"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="420" height="320" fill="#f8fafc" />

      {/* Top measurement line */}
      <line x1="78" y1="36" x2="338" y2="36" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="78" y1="30" x2="78" y2="42" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="338" y1="30" x2="338" y2="42" stroke="#cbd5e1" strokeWidth="2" />

      <rect x="180" y="26" width="56" height="20" rx="10" fill="#eef2f7" />
      <text
        x="208"
        y="40"
        textAnchor="middle"
        fill="#64748b"
        fontSize="11"
        fontWeight="700"
      >
        {displayLength}
      </text>

      {/* Left measurement line */}
      <line x1="30" y1="72" x2="30" y2="258" stroke="#94a3b8" strokeWidth="2" />
      <line x1="24" y1="72" x2="36" y2="72" stroke="#94a3b8" strokeWidth="2" />
      <line x1="24" y1="258" x2="36" y2="258" stroke="#94a3b8" strokeWidth="2" />

      <rect x="14" y="140" width="32" height="22" rx="6" fill="#eef2f7" />
      <text
        x="30"
        y="155"
        textAnchor="middle"
        fill="#64748b"
        fontSize="11"
        fontWeight="700"
        transform="rotate(-90 30 151)"
      >
        {displayWidth}
      </text>

      {/* Room */}
      <line x1="78" y1="72" x2="338" y2="72" stroke="#273449" strokeWidth="6" />
      <line x1="338" y1="72" x2="338" y2="258" stroke="#273449" strokeWidth="6" />
      <line x1="338" y1="258" x2="78" y2="258" stroke="#273449" strokeWidth="6" />
      <line x1="78" y1="72" x2="78" y2="208" stroke="#273449" strokeWidth="6" />

      {/* small door gap hint */}
      <line x1="78" y1="208" x2="78" y2="214" stroke="#f8fafc" strokeWidth="8" />
      <line x1="78" y1="222" x2="78" y2="258" stroke="#273449" strokeWidth="6" />

      <line x1="70" y1="258" x2="88" y2="258" stroke="#273449" strokeWidth="2" />
    </svg>
  );
}