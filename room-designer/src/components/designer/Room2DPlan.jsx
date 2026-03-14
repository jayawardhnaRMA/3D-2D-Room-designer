import { useRef, useState } from "react";

export default function Room2DPlan({
  config,
  roomItems,
  selectedItemId,
  onSelectItem,
  onMoveItem,
}) {
  const width = config.dimensions.width;
  const length = config.dimensions.length;

  const planWidth = 700;
  const planHeight = 500;
  const padding = 50;

  const roomRectWidth = planWidth - padding * 2;
  const roomRectHeight = planHeight - padding * 2;

  const maxX = width / 2;
  const minX = -width / 2;
  const maxZ = length / 2;
  const minZ = -length / 2;

  const svgRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const mapX = (x) =>
    padding + ((x - minX) / (maxX - minX)) * roomRectWidth;

  const mapY = (z) =>
    padding + ((z - minZ) / (maxZ - minZ)) * roomRectHeight;

  const unmapX = (svgX) =>
    minX + ((svgX - padding) / roomRectWidth) * (maxX - minX);

  const unmapZ = (svgY) =>
    minZ + ((svgY - padding) / roomRectHeight) * (maxZ - minZ);

  const handlePointerMove = (event) => {
    if (!draggingId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const svgX = event.clientX - rect.left;
    const svgY = event.clientY - rect.top;

    const x = unmapX(svgX);
    const z = unmapZ(svgY);

    onMoveItem(draggingId, [x, 0, z]);
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef1f4",
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        ref={svgRef}
        width={planWidth}
        height={planHeight}
        style={{ userSelect: "none" }}
        onClick={() => onSelectItem(null)}
      >
        <rect
          x={padding}
          y={padding}
          width={roomRectWidth}
          height={roomRectHeight}
          fill="#faf7f1"
          stroke="#7389b7"
          strokeWidth="3"
          rx="2"
        />

        {roomItems.map((item) => {
          const isSelected = item.instanceId === selectedItemId;
          const x = mapX(item.position[0]);
          const y = mapY(item.position[2]);

          return (
            <g
              key={item.instanceId}
              transform={`translate(${x}, ${y})`}
              style={{ cursor: "grab" }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item.instanceId);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectItem(item.instanceId);
                setDraggingId(item.instanceId);
              }}
            >
              <rect
                x={-28}
                y={-18}
                width="56"
                height="36"
                rx="6"
                fill={isSelected ? "#2f66e8" : "#c98241"}
                stroke={isSelected ? "#153f9d" : "#8d4c1f"}
                strokeWidth="2"
              />
              <text
                x="0"
                y="4"
                fontSize="10"
                textAnchor="middle"
                fill="#ffffff"
                style={{ pointerEvents: "none", fontWeight: 700 }}
              >
                {item.name}
              </text>
            </g>
          );
        })}

        <text
          x={planWidth / 2}
          y={24}
          textAnchor="middle"
          fontSize="15"
          fill="#334155"
          style={{ fontWeight: 700 }}
        >
          2D Plan
        </text>
      </svg>
    </div>
  );
}