export default function CartDrawer({ open, items, onClose }) {
  const summary = items.reduce((acc, item) => {
    const existing = acc.find((x) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }
    return acc;
  }, []);

  const total = summary.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: open ? 0 : -360,
        width: 340,
        height: "100vh",
        background: "#fff",
        boxShadow: open ? "-8px 0 24px rgba(0,0,0,0.14)" : "none",
        transition: "right 0.25s ease",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 18,
          borderBottom: "1px solid #ececec",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 20 }}>Cart</div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {summary.length === 0 ? (
          <div style={{ color: "#64748b" }}>No items in cart.</div>
        ) : (
          summary.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e7e7e7",
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>
                Qty: {item.quantity}
              </div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>
                ${item.price * item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid #ececec" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 800,
            fontSize: 18,
            marginBottom: 12,
          }}
        >
          <span>Total</span>
          <span>${total}</span>
        </div>

        <button
          style={{
            width: "100%",
            height: 44,
            border: "none",
            borderRadius: 12,
            background: "#2f66e8",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}