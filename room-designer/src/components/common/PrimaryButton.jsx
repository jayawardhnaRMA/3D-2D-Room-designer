export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "14px 20px",
        borderRadius: "12px",
        border: "none",
        background: disabled ? "#94a3b8" : "#2f66e8",
        color: "#fff",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        boxShadow: "0 8px 18px rgba(47,102,232,0.22)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}