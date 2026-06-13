"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface ShellProps {
  radius: number;
  electronCount: number;
  isValence: boolean;
  shellIndex: number;
  totalShells: number;
}

function Shell({ radius, electronCount, isValence, shellIndex, totalShells }: ShellProps) {
  const groupRef = useRef<THREE.Group>(null);

  // All shells parallel (Bohr model style) — no tilt
  const tiltX = 0;
  const tiltZ = 0;

  // Smooth rotation — each shell at a slightly different speed
  const speed = 0.4 - shellIndex * 0.05;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  const ringColor = isValence ? "#f59e0b" : "#94a3b8";
  const electronColor = isValence ? "#f59e0b" : "#3b82f6";

  // Electrons evenly spaced on the ring (XZ plane, y=0)
  const electronPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < electronCount; i++) {
      const angle = (i / electronCount) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ]);
    }
    return positions;
  }, [electronCount, radius]);

  // Ring (circle in XZ plane)
  const ringGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <group ref={groupRef}>
        {/* Orbit ring */}
        <line>
          <bufferGeometry attach="geometry" {...ringGeometry} />
          <lineBasicMaterial
            attach="material"
            color={ringColor}
            opacity={isValence ? 0.6 : 0.3}
            transparent
          />
        </line>
        {/* Electrons on the ring */}
        {electronPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[isValence ? 0.1 : 0.07, 16, 16]} />
            <meshStandardMaterial
              color={electronColor}
              emissive={electronColor}
              emissiveIntensity={isValence ? 0.6 : 0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Nucleus({ size }: { size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Gentle pulse
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.03;
      meshRef.current.scale.set(s, s, s);
    }
  });

  const r = Math.min(0.15 + size * 0.005, 0.35);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[r, 32, 32]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
    </mesh>
  );
}

interface ElectronShell3DProps {
  shells: number[];
  symbol: string;
  className?: string;
}

export default function ElectronShell3D({ shells, symbol, className = "" }: ElectronShell3DProps) {
  const totalElectrons = shells.reduce((a, b) => a + b, 0);

  // Scale radius based on number of shells so it fits nicely
  const baseRadius = shells.length <= 3 ? 0.9 : shells.length <= 5 ? 0.7 : 0.55;
  const radiusStep = shells.length <= 3 ? 0.7 : shells.length <= 5 ? 0.55 : 0.42;

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-3, -3, -3]} intensity={0.4} />
        <Nucleus size={totalElectrons} />
        {shells.map((count, i) => (
          <Shell
            key={i}
            radius={baseRadius + i * radiusStep}
            electronCount={count}
            isValence={i === shells.length - 1}
            shellIndex={i}
            totalShells={shells.length}
          />
        ))}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>
    </div>
  );
}
