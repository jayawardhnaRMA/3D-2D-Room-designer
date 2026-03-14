import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  return (
    <Html center style={{ color: "#333", fontWeight: 700 }}>
      Loading...
    </Html>
  );
}

function RoomShell({ config }) {
  const w = config.dimensions.width;
  const l = config.dimensions.length;
  const h = config.dimensions.height;

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.colors.wall,
        side: THREE.DoubleSide,
      }),
    [config.colors.wall]
  );

  const sideWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.colors.floorColor,
        side: THREE.DoubleSide,
      }),
    [config.colors.floorColor]
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.colors.floorColor,
        roughness: config.colors.floorMaterial === "wood" ? 0.85 : 0.6,
        metalness: 0.05,
      }),
    [config.colors.floorColor, config.colors.floorMaterial]
  );

  return (
    <group>
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
        <primitive object={sideWallMaterial} attach="material" />
      </mesh>

      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[l, h]} />
        <primitive object={sideWallMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function DragPlane({ onReady }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) onReady(ref.current);
  }, [onReady]);

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.001, 0]}
      visible={false}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

function FurnitureModel({
  item,
  isSelected,
  onSelect,
  onMove,
  dragPlaneRef,
}) {
  const { scene } = useGLTF(item.model);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef();
  const { camera, gl, raycaster } = useThree();
  const [dragging, setDragging] = useState(false);

  const pointerToWorld = (event) => {
    if (!dragPlaneRef.current) return null;

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(dragPlaneRef.current);
    if (!hits.length) return null;

    return hits[0].point;
  };

  const handlePointerDown = (event) => {
    event.stopPropagation();
    onSelect(item.instanceId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;
    event.stopPropagation();

    const point = pointerToWorld(event);
    if (!point) return;

    onMove(item.instanceId, [point.x, 0, point.z]);
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setDragging(false);
  };

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerMissed={() => setDragging(false)}
    >
      <primitive object={cloned} />
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 32]} />
          <meshBasicMaterial color="#2f66e8" transparent opacity={0.95} />
        </mesh>
      )}
    </group>
  );
}

export default function DesignerCanvas({
  config,
  roomItems,
  rotationLocked,
  selectedItemId,
  onSelectItem,
  onMoveItem,
}) {
  const h = config.dimensions.height;
  const dragPlaneRef = useRef(null);

  return (
    <Canvas
      shadows
      camera={{
        position: [0, h * 0.95, Math.max(config.dimensions.width, config.dimensions.length) * 1.45],
        fov: 42,
      }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => onSelectItem(null)}
    >
      <color attach="background" args={["#edf0f3"]} />
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="apartment" />

      <Suspense fallback={<Loader />}>
        <RoomShell config={config} />
        <DragPlane onReady={(mesh) => (dragPlaneRef.current = mesh)} />

        {roomItems.map((item) => (
          <FurnitureModel
            key={item.instanceId}
            item={item}
            isSelected={selectedItemId === item.instanceId}
            onSelect={onSelectItem}
            onMove={onMoveItem}
            dragPlaneRef={dragPlaneRef}
          />
        ))}
      </Suspense>

      <OrbitControls
        enableRotate={!rotationLocked}
        enablePan={false}
        minDistance={3}
        maxDistance={18}
        target={[0, h / 3, 0]}
      />
    </Canvas>
  );
}