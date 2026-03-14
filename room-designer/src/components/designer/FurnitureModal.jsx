import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";

function PreviewLoader() {
  return (
    <Html center>
      <div style={{ fontWeight: 700, color: "#334155" }}>Loading...</div>
    </Html>
  );
}

function AutoRotatingModel({ model, scale }) {
  const { scene } = useGLTF(model);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.9;
    }
  });

  return (
    <group ref={groupRef} scale={scale || [1, 1, 1]} position={[0, -0.35, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

function ModelPreview({ item }) {
  return (
    <div
      style={{
        height: 170,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <Canvas camera={{ position: [0, 1.2, 3.4], fov: 35 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 3]} intensity={1.4} />
        <Suspense fallback={<PreviewLoader />}>
          <AutoRotatingModel
            model={item.model}
            scale={item.previewScale || item.scale || [1, 1, 1]}
          />
          <Environment preset="apartment" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}

export default function FurnitureModal({ item, onClose, onAddToRoom }) {
  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 360,
          background: "#f7f4f2",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(0,0,0,0.24)",
        }}
      >
        <div style={{ padding: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800 }}>{item.name}</div>

            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                color: "#d8d3cf",
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <ModelPreview item={item} />
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#665f5a",
              lineHeight: 1.5,
              minHeight: 44,
            }}
          >
            {item.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                background: "#ece8e5",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 12, color: "#7b7671", marginBottom: 6 }}>
                Price
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>${item.price}</div>
            </div>

            <div
              style={{
                background: "#ece8e5",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 12, color: "#7b7671", marginBottom: 6 }}>
                Material
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{item.material}</div>
            </div>
          </div>

          <div
            style={{
              background: "#ece8e5",
              borderRadius: 10,
              padding: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 12, color: "#7b7671", marginBottom: 6 }}>
              Dimensions
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{item.dimensions}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={() => onAddToRoom(item)}
              style={{
                height: 40,
                border: "none",
                borderRadius: 12,
                background: "#f09333",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Add to Room
            </button>

            <button
              onClick={onClose}
              style={{
                height: 40,
                border: "1px solid #cec7c2",
                borderRadius: 12,
                background: "#fff",
                color: "#333",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}