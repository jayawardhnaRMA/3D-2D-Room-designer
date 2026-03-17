import Card from "../common/Card";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function RoomPreview({ config }) {
  const w = config.dimensions.width;
  const l = config.dimensions.length;
  const h = config.dimensions.height;
  const shape = config.shape || "rectangle";

  const wallMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: config.colors.wall,
      side: THREE.DoubleSide,
    }),
    [config.colors.wall]
  );

  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: config.colors.floorColor,
      roughness: config.colors.floorMaterial === "wood" ? 0.85 : 0.6,
      metalness: 0.05,
    }),
    [config.colors.floorColor, config.colors.floorMaterial]
  );

  // Compute L-shape dimensions
  const mainWidth = w;
  const mainLength = l;
  const subWidth = w * 0.4;  // Width of the cutout
  const subLength = l * 0.5; // Length of the cutout
  const x0 = -mainWidth / 2;
  const z0 = -mainLength / 2;

  return (
    <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
      <Suspense fallback={null}>
        <group>
          {shape === "rectangle" || !shape ? (
            <>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[w, l]} />
                <primitive object={floorMaterial} attach="material" />
              </mesh>

              <mesh position={[0, h / 2, -l / 2]} receiveShadow>
                <planeGeometry args={[w, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[l, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[l, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>
            </>
          ) : (
            <>
              {/* L-Shape Floor: Two non-overlapping rectangles that completely fill the L */}
              
              {/* Rectangle 1: Full bottom section (mainWidth × subLength) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x0 + mainWidth / 2, 0.001, z0 + subLength / 2]} receiveShadow>
                <planeGeometry args={[mainWidth, subLength]} />
                <primitive object={floorMaterial} attach="material" />
              </mesh>

              {/* Rectangle 2: Left upper section ((mainWidth-subWidth) × (mainLength-subLength)) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x0 + (mainWidth - subWidth) / 2, 0.001, z0 + subLength + (mainLength - subLength) / 2]} receiveShadow>
                <planeGeometry args={[mainWidth - subWidth, mainLength - subLength]} />
                <primitive object={floorMaterial} attach="material" />
              </mesh>

              {/* 6 Walls aligned to L-shape perimeter */}
              
              {/* Wall 1: Bottom (Points 1→2) - HIDDEN for interior view */}
              {/* <mesh position={[x0 + mainWidth / 2, h / 2, z0]} receiveShadow>
                <planeGeometry args={[mainWidth, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh> */}

              {/* Wall 2: Right Lower (Points 2→3) - subLength height */}
              <mesh position={[x0 + mainWidth, h / 2, z0 + subLength / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[subLength, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              {/* Wall 3: Inner Horizontal (Points 3→4) - subWidth */}
              <mesh position={[x0 + mainWidth - subWidth / 2, h / 2, z0 + subLength]} receiveShadow>
                <planeGeometry args={[subWidth, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              {/* Wall 4: Right Upper (Points 4→5) - (mainLength-subLength) height */}
              <mesh position={[x0 + mainWidth - subWidth, h / 2, z0 + subLength + (mainLength - subLength) / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[mainLength - subLength, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              {/* Wall 5: Top (Points 5→6) - (mainWidth-subWidth) */}
              <mesh position={[x0 + (mainWidth - subWidth) / 2, h / 2, z0 + mainLength]} receiveShadow>
                <planeGeometry args={[mainWidth - subWidth, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh>

              {/* Wall 6: Left (Points 6→1) - HIDDEN for interior view */}
              {/* <mesh position={[x0, h / 2, z0 + mainLength / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[mainLength, h]} />
                <primitive object={wallMaterial} attach="material" />
              </mesh> */}
            </>
          )}

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
          </group>
          <Environment preset="apartment" />
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>);}

export default function StepReview({ data }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
      }}
    >
      <div style={{ background: "#eee", borderRadius: "8px", overflow: "hidden", minHeight: "400px" }}>
        <RoomPreview config={data} />
      </div>

      <Card>
        <h3 style={{ marginTop: 0, marginBottom: 18 }}>Room Summary</h3>

        <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
          <div><strong>Project:</strong> {data.projectName}</div>
          <div><strong>Type:</strong> {data.roomType}</div>
          <div>
            <strong>Size:</strong> {data.dimensions.length} Ã— {data.dimensions.width} Ã— {data.dimensions.height} {data.dimensions.unit}
          </div>
          <div><strong>Shape:</strong> {data.shape}</div>
          
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <strong>Wall Color:</strong>
              <div style={{
                width: 20,
                height: 20,
                background: data.colors.wall,
                border: "1px solid #ccc",
                borderRadius: 3,
              }} />
              <span style={{ fontSize: "12px", color: "#666" }}>{data.colors.wall}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <strong>Floor:</strong>
              <div style={{
                width: 20,
                height: 20,
                background: data.colors.floorColor,
                border: "1px solid #ccc",
                borderRadius: 3,
              }} />
              <span style={{ fontSize: "12px", color: "#666" }}>{data.colors.floorMaterial}</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "12px" }}>
            <div><strong>Lighting:</strong></div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: 4 }}>
              {data.lighting.naturalLightDirection} @ {data.lighting.timeOfDay}:00
            </div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: 4 }}>
              Fixtures: {data.lighting.fixtures.length > 0 ? data.lighting.fixtures.join(", ") : "None"}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: "#dcfce7",
          borderRadius: 8,
          borderLeft: "4px solid #22c55e",
        }}>
          <p style={{
            margin: 0,
            fontSize: "13px",
            color: "#15803d",
            fontWeight: 500,
          }}>
            âœ“ All settings ready to launch editor
          </p>
        </div>
      </Card>
    </div>
  );
}



