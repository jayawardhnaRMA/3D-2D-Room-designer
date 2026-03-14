const FILTERS = ["All", "Seating", "Tables"];

export default function FurnitureLibrary({
  items,
  search,
  setSearch,
  filter,
  setFilter,
  onSelectItem,
}) {
  return (
    <aside
      style={{
        width: 266,
        background: "#ffffff",
        borderRight: "1px solid #e8e8e8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ padding: "18px 14px 12px", borderBottom: "1px solid #ececec" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#182033",
            marginBottom: 14,
          }}
        >
          Furniture Library ({items.length})
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search furniture..."
          style={{
            width: "100%",
            height: 34,
            borderRadius: 10,
            border: "1px solid #cb4aa0",
            outline: "none",
            padding: "0 14px",
            fontSize: 14,
            marginBottom: 10,
          }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                onClick={() => setFilter(item)}
                style={{
                  border: "none",
                  background: active ? "#dbe7ff" : "#f2f4f7",
                  color: active ? "#2f66e8" : "#5d6a82",
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: 10,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
          alignContent: "start",
          overflowY: "auto",
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{
              border: "1px solid #e6dfd9",
              background: "#fff",
              borderRadius: 12,
              minHeight: 112,
              padding: "10px 8px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ maxWidth: 56, maxHeight: 34, objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1f2430",
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#257345",
              }}
            >
              ${item.price}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}