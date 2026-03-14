export default function SecondaryButton({
  children,
  onClick,
  type = "button",
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "14px 20px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#1e293b",
        fontWeight: 700,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}