import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  const shape = config.shape || "rectangle";

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.colors.wall,
        side: THREE.DoubleSide,
      }),
    [config.colors.wall]
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

  // Render rectangular room
  if (shape === "rectangle" || !shape) {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, l]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, h / 2, -l / 2]} receiveShadow>
          <planeGeometry args={[w, h]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[l, h]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Right Wall */}
        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[l, h]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
      </group>
    );
  }

  // Render L-shaped room
  if (shape === "l-shape") {
    // L-shape dimensions with cutout
    const mainWidth = w;
    const mainLength = l;
    const subWidth = w * 0.4;  // Width of cutout on right
    const subLength = l * 0.5; // Height of cutout on top-right

    // Center offsets for proper positioning
    const x0 = -mainWidth / 2;
    const z0 = -mainLength / 2;

    return (
      <group>
        {/* FLOOR: Two non-overlapping rectangles forming complete L-shape */}
        
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

        {/* WALLS: 6 walls aligned to L-shape perimeter - hide front walls for viewing */}
        
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
      </group>
    );
  }

  // Default to rectangle for custom or unknown shapes
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
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[l, h]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function DragPlane({ onReady, config }) {
  const ref = useRef();
  const w = config.dimensions.width || 10;
  const l = config.dimensions.length || 10;

  useEffect(() => {
    if (ref.current) onReady(ref.current);
  }, [onReady]);

  // For L-shape, create a larger plane that covers the bounding box
  const size = Math.max(w, l) * 1.5; // Make it larger to catch all drags

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.001, 0]}
      visible={false}
    >
      <planeGeometry args={[size, size]} />
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

  const pointerToWorld = useCallback((event) => {
    if (!dragPlaneRef.current) return null;

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(dragPlaneRef.current, true);
    if (!hits.length) return null;

    return hits[0].point;
  }, [dragPlaneRef, gl, raycaster, camera]);

  const handlePointerDown = (event) => {
    // Allow drag whenever furniture is clicked
    event.stopPropagation();
    onSelect(item.instanceId);
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event) => {
      const point = pointerToWorld(event);
      if (!point) return;
      onMove(item.instanceId, [point.x, 0, point.z]);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    // Listen on document for reliable dragging across entire viewport
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, dragPlaneRef, camera, gl, raycaster, item.instanceId, onMove]);

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onPointerDown={handlePointerDown}
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
  exportRef,
}) {
  const h = config.dimensions.height;
  const dragPlaneRef = useRef(null);

  // Calculate light direction based on natural light setting
  const getLightPositionFromDirection = () => {
    const direction = config.lighting?.naturalLightDirection || "south";
    const timeOfDay = config.lighting?.timeOfDay || 14;
    const baseDistance = 8;
    
    // Adjust light angle based on time of day (6-20)
    const dayPhase = (timeOfDay - 6) / 14; // 0 to 1
    const elevation = 2 + dayPhase * 4; // 2 to 6 units height

    switch (direction) {
      case "north":
        return [0, elevation, baseDistance];
      case "south":
        return [0, elevation, -baseDistance];
      case "east":
        return [baseDistance, elevation, 0];
      case "west":
        return [-baseDistance, elevation, 0];
      default:
        return [4, elevation, 4];
    }
  };

  const lightPosition = useMemo(() => getLightPositionFromDirection(), [config.lighting?.naturalLightDirection, config.lighting?.timeOfDay]);

  // Calculate ambient light intensity based on time of day
  const getAmbientIntensity = () => {
    const timeOfDay = config.lighting?.timeOfDay || 14;
    if (timeOfDay < 8 || timeOfDay > 18) return 0.6; // Early morning / evening
    if (timeOfDay < 10 || timeOfDay > 16) return 0.9; // Morning / afternoon
    return 1.1; // Midday
  };

  const ambientIntensity = useMemo(() => getAmbientIntensity(), [config.lighting?.timeOfDay]);

  // Expose screenshot function to parent if ref provided
  const handleScreenshot = (callback) => {
    const canvas = document.querySelector('main canvas');
    if (!canvas) {
      callback(null, 'Canvas not found');
      return;
    }
    try {
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      if (!imageData || imageData === 'data:image/jpeg;base64,') {
        callback(null, 'Canvas is empty');
        return;
      }
      callback(imageData, null);
    } catch (error) {
      callback(null, error.message);
    }
  };

  if (exportRef) {
    exportRef.current = { screenshot: handleScreenshot };
  }

  return (
    <Canvas
      shadows
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
      }}
      camera={{
        position: [0, h * 0.95, Math.max(config.dimensions.width, config.dimensions.length) * 1.45],
        fov: 42,
      }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => onSelectItem(null)}
    >
      <color attach="background" args={["#edf0f3"]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={lightPosition}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="apartment" />

      <Suspense fallback={<Loader />}>
        <RoomShell config={config} />
        <DragPlane onReady={(mesh) => (dragPlaneRef.current = mesh)} config={config} />

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
