import Card from "../common/Card";
import WizardProgress from "./WizardProgress";
import { X } from "lucide-react";

export default function WizardLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
  footer,
  onClose,
}) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f7fb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 24px 48px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
          }}
        >
          <Card>
            {/* Close button in top right */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              {onClose && (
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    color: "#66758f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Close wizard"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />

            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: "44px",
                  margin: "0 0 10px",
                  color: "#182033",
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#66758f",
                  fontSize: "18px",
                }}
              >
                {subtitle}
              </p>
            </div>

            <div>{children}</div>

            <div style={{ marginTop: 32 }}>{footer}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
