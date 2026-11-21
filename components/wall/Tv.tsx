'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Slot, StyleEntry } from '@/lib/styles';
import { createCardTexture, createCrtMaterial, createLabelTexture, createVideoTexture } from './crt';

const BODY_COLORS = ['#cfc6b0', '#1c1c1c', '#3a3a3c', '#5a3a22', '#8d8a84', '#7a1f17', '#b9a35a', '#2b2b2e'];

type Props = {
  index: number;
  slot: Slot;
  style?: StyleEntry;
  lite: boolean;
  /** On air: the one TV whose preview plays at full brightness. Every other screen rests. */
  live: boolean;
  onHover: (index: number | null) => void;
  onPick: (index: number, screen: THREE.Mesh) => void;
  registerScreen: (index: number, screen: THREE.Mesh) => void;
};

export function Tv({ index, slot, style, lite, live, onHover, onPick, registerScreen }: Props) {
  const screen = useRef<THREE.Mesh>(null);
  // Deterministic per-slot variation so the wall looks the same on every load.
  const sidePanel = index % 3 !== 1;
  const color = BODY_COLORS[(index * 5) % BODY_COLORS.length];
  const depth = slot.h * (0.75 + ((index * 7) % 4) * 0.1);

  const material = useMemo(() => {
    const map = style?.preview ? createVideoTexture(style.preview) : createCardTexture(style ? style.name : null);
    return createCrtMaterial(map, lite, index * 13.7);
  }, [style, lite, index]);

  const label = useMemo(() => (style ? createLabelTexture(style.name) : null), [style]);
  useEffect(() => () => label?.dispose(), [label]);

  useEffect(() => {
    if (screen.current) registerScreen(index, screen.current);
    return () => {
      const map = material.uniforms.uMap.value as THREE.Texture;
      if (map instanceof THREE.VideoTexture) (map.image as HTMLVideoElement).pause();
      map.dispose();
      material.dispose();
    };
  }, [material, index, registerScreen]);

  // Coming on air: restart the loop and burst into static, like flipping to this channel. Going off air: pause.
  useEffect(() => {
    const map = material.uniforms.uMap.value;
    const video = map instanceof THREE.VideoTexture ? (map.image as HTMLVideoElement) : null;
    if (live) {
      material.uniforms.uNoise.value = 0.9;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {}); // autoplay refused: the texture just holds its first frame
      }
    } else video?.pause();
  }, [live, material]);

  useFrame((state, dt) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    const k = Math.min(1, dt * 4);
    u.uDim.value += ((live ? 0 : 1) - u.uDim.value) * k;
    if (material.userData.locked) return; // a dive owns uNoise while it runs
    const target = !style ? 0.45 : live ? 0.06 : 0.12;
    u.uNoise.value += (target - u.uNoise.value) * k;
  });

  const sw = slot.w * (sidePanel ? 0.68 : 0.82);
  // A labeled set gives up a little glass and lifts it, so the nameplate fits on the face below.
  const sh = slot.h * (style ? 0.7 : 0.74);
  const sx = sidePanel ? -slot.w * 0.1 : 0;
  const sy = style ? slot.h * 0.04 : 0;
  const plateGap = slot.h / 2 + sy - (sh * 1.08) / 2; // face strip under the bezel
  const plateW = Math.min(sw * 0.8, (plateGap * 0.68) / 0.1875);

  const interactive = style
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(index);
          document.body.style.cursor = 'pointer';
        },
        onPointerOut: () => {
          onHover(null);
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
    // Handlers on the whole set, not just the glass: a bigger target for fingers.
    <group position={[slot.x, slot.base + slot.h / 2, slot.z]} rotation={[0, slot.rotY, 0]} {...interactive}>
      <RoundedBox args={[slot.w, slot.h, depth]} radius={Math.min(slot.w, slot.h) * 0.06} smoothness={lite ? 2 : 4} position={[0, 0, -depth / 2]}>
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </RoundedBox>
      {/* tapered back hood, like a real tube set */}
      <mesh position={[0, 0, -depth - depth * 0.2]}>
        <boxGeometry args={[slot.w * 0.6, slot.h * 0.6, depth * 0.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* feet */}
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * slot.w * 0.36, -slot.h / 2 + 0.008, -depth * 0.3]}>
          <boxGeometry args={[slot.w * 0.1, 0.016, depth * 0.5]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
      {/* recessed black bezel */}
      <mesh position={[sx, sy, 0.002]}>
        <planeGeometry args={[sw * 1.06, sh * 1.08]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh ref={screen} position={[sx, sy, 0.006]} material={material}>
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
          {/* speaker grille */}
          {[0, 1, 2, 3].map((k) => (
            <mesh key={`g${k}`} position={[0, -slot.h * 0.33 - k * slot.h * 0.035, 0]}>
              <planeGeometry args={[slot.w * 0.14, slot.h * 0.012]} />
              <meshStandardMaterial color="#111" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
      {label && (
        <mesh position={[sx, -slot.h / 2 + plateGap / 2, 0.008]}>
          <planeGeometry args={[plateW, plateW * 0.1875]} />
          <meshBasicMaterial map={label} toneMapped={false} />
        </mesh>
      )}
      {/* rabbit ears on the sets nothing is stacked on */}
      {slot.base >= 1.2 && (
        <group position={[0, slot.h / 2, -depth / 2]}>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.024, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          {[-1, 1].map((k) => (
            <mesh key={k} position={[k * 0.1, 0.17, 0]} rotation={[0, 0, -k * 0.55]}>
              <cylinderGeometry args={[0.004, 0.004, 0.36, 6]} />
              <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
