export default function WizardProgress({ currentStep, totalSteps }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          fontWeight: 700,
          color: "#1f3c88",
        }}
      >
        <span>STEP {currentStep} OF {totalSteps}</span>
        <span>{percent}% Complete</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "6px",
          borderRadius: "999px",
          background: "#dbe3ef",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#2f66e8",
          }}
        />
      </div>
    </div>
  );
}