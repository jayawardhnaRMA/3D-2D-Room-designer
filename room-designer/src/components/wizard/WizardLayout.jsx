import Card from "../common/Card";
import WizardProgress from "./WizardProgress";

export default function WizardLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
  footer,
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 24px 48px",
        }}
      >
        {/* Logo + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: "30px",
            fontWeight: 800,
            marginBottom: 24,
            color: "#2563eb",
          }}
        >
          <img
            src="/logo/logo.png"
            alt="Roomio"
            style={{
              height: 34,
              width: 34,
              objectFit: "contain",
            }}
          />
          <span>Roomio</span>
        </div>

        <Card>
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
  );
}