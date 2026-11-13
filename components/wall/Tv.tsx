'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Slot, StyleEntry } from '@/lib/styles';
import { createCardTexture, createCrtMaterial, createVideoTexture } from './crt';

const BODY_COLORS = ['#cfc6b0', '#1c1c1c', '#3a3a3c', '#5a3a22', '#8d8a84', '#7a1f17', '#b9a35a', '#2b2b2e'];

type Props = {
  index: number;
  slot: Slot;
  style?: StyleEntry;
  lite: boolean;
  onPick: (index: number, screen: THREE.Mesh) => void;
  registerScreen: (index: number, screen: THREE.Mesh) => void;
};

export function Tv({ index, slot, style, lite, onPick, registerScreen }: Props) {
  const screen = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  // Deterministic per-slot variation so the wall looks the same on every load.
  const sidePanel = index % 3 !== 1;
  const color = BODY_COLORS[(index * 5) % BODY_COLORS.length];
  const depth = slot.h * (0.75 + ((index * 7) % 4) * 0.1);

  const material = useMemo(() => {
    const map = style?.preview ? createVideoTexture(style.preview) : createCardTexture(style ? style.name : null);
    return createCrtMaterial(map, lite, index * 13.7);
  }, [style, lite, index]);

  useEffect(() => {
    if (screen.current) registerScreen(index, screen.current);
    return () => {
      const map = material.uniforms.uMap.value as THREE.Texture;
      if (map instanceof THREE.VideoTexture) (map.image as HTMLVideoElement).pause();
      map.dispose();
      material.dispose();
    };
  }, [material, index, registerScreen]);

  useFrame((state, dt) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    if (material.userData.locked) return; // a dive owns uNoise while it runs
    const target = !style ? 0.5 : hover ? 0.55 : 0.08;
    u.uNoise.value += (target - u.uNoise.value) * Math.min(1, dt * 8);
  });

  const sw = slot.w * (sidePanel ? 0.68 : 0.82);
  const sh = slot.h * 0.74;
  const sx = sidePanel ? -slot.w * 0.1 : 0;

  const interactive = style
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        },
        onPointerOut: () => {
          setHover(false);
          document.body.style.cursor = '';
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = '';
          if (screen.current) onPick(index, screen.current);
        },
      }
    : {};

  return (
    <group position={[slot.x, slot.base + slot.h / 2, slot.z]} rotation={[0, slot.rotY, 0]}>
      <mesh position={[0, 0, -depth / 2]} castShadow={false}>
        <boxGeometry args={[slot.w, slot.h, depth]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* recessed black bezel */}
      <mesh position={[sx, 0, 0.002]}>
        <planeGeometry args={[sw * 1.06, sh * 1.08]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh ref={screen} position={[sx, 0, 0.006]} material={material} {...interactive}>
        <planeGeometry args={[sw, sh]} />
      </mesh>
      {sidePanel && (
        <group position={[slot.w * 0.37, slot.h * 0.18, 0.01]}>
          {[0, 1].map((k) => (
            <mesh key={k} position={[0, -k * slot.h * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[slot.w * 0.045, slot.w * 0.045, 0.03, 16]} />
              <meshStandardMaterial color="#222" roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
