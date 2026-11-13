'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WALL_W = 14;
const WALL_H = 7;
const WALL_Z = -1.3;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// shortcut: procedural posters/graffiti; swap for real photographed textures if supplied.
function paintBackWall() {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext('2d')!;
  const r = rng(7);
  const X = (wx: number) => ((wx + WALL_W / 2) / WALL_W) * c.width;
  const Y = (wy: number) => ((WALL_H - wy) / WALL_H) * c.height;

  g.fillStyle = '#1b1917';
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},${r() * 0.06})`;
    g.fillRect(r() * c.width, r() * c.height, 1 + r() * 3, 1 + r() * 3);
  }
  for (let i = 0; i < 14; i++) {
    const x = r() * c.width;
    const y = r() * c.height;
    const grad = g.createRadialGradient(x, y, 0, x, y, 60 + r() * 220);
    grad.addColorStop(0, 'rgba(0,0,0,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
  }

  const posters: [number, number, string, string, string][] = [
    // wx, wy, paper, ink, text
    [-4.6, 3.4, '#d9d2bf', '#b3261e', 'CHANNEL\nZERO'],
    [-3.3, 2.6, '#e8e1cc', '#111', 'NO\nSIGNAL\nTONIGHT'],
    [3.4, 3.2, '#c23b22', '#f2e9d8', 'TUNE\nIN'],
    [4.7, 2.4, '#efe6cf', '#1f3b8a', 'VIDEO\nART\n1994'],
    [-1.9, 3.5, '#f3ead2', '#222', 'STATIC'],
    [2.0, 3.6, '#1c1c1c', '#e9d35b', 'LIVE\nFEED'],
  ];
  for (const [wx, wy, paper, ink, text] of posters) {
    const w = 150 + r() * 70;
    const h = w * 1.35;
    g.save();
    g.translate(X(wx), Y(wy));
    g.rotate((r() - 0.5) * 0.12);
    g.fillStyle = paper;
    g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = 'rgba(0,0,0,0.25)'; // tears and dirt
    for (let i = 0; i < 40; i++) g.fillRect(-w / 2 + r() * w, -h / 2 + r() * h, r() * 14, r() * 3);
    g.fillStyle = ink;
    g.font = `900 ${w * 0.26}px Impact, "Arial Black", sans-serif`;
    g.textAlign = 'center';
    const lines = text.split('\n');
    lines.forEach((ln, i) => g.fillText(ln, 0, -h * 0.2 + i * w * 0.28, w * 0.9));
    g.restore();
  }

  const tags: [number, number, string, string, number][] = [
    [-5.2, 1.4, 'FLUXION', '#e6427a', 0.08],
    [5.0, 1.2, 'rewind', '#4fd1c5', -0.1],
    [0, 4.4, 'NOTHING IS ON', '#f5f1e6', -0.03],
    [-3.6, 4.6, 'snow', '#e8b04b', 0.15],
  ];
  for (const [wx, wy, text, color, rot] of tags) {
    g.save();
    g.translate(X(wx), Y(wy));
    g.rotate(rot);
    g.font = `italic 900 ${70 + r() * 40}px Impact, "Arial Black", sans-serif`;
    g.textAlign = 'center';
    g.shadowColor = color;
    g.shadowBlur = 14;
    g.fillStyle = color;
    g.globalAlpha = 0.8;
    g.fillText(text, 0, 0);
    g.shadowBlur = 0;
    const tw = g.measureText(text).width;
    for (let i = 0; i < 6; i++) g.fillRect(-tw / 2 + r() * tw, 8, 2, 20 + r() * 70); // drips
    g.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function Room({ lite }: { lite: boolean }) {
  const wallTex = useMemo(paintBackWall, []);
  const lights = useRef<THREE.PointLight[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    lights.current.forEach((l, i) => {
      if (l) l.intensity = l.userData.base * (0.85 + 0.15 * Math.sin(t * (3 + i * 1.7)) * Math.sin(t * 11 + i));
    });
  });

  const glow: [number, number, number, string, number][] = [
    [-1.6, 1.0, 1.2, '#ff5fb4', 3],
    [1.7, 1.0, 1.2, '#7fd8ff', 2.5],
    [0, 1.8, 1.4, '#ffd9a8', 3.5],
  ];

  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 5, 14]} />
      <ambientLight intensity={0.06} />
      {glow.map(([x, y, z, c, i], k) => (
        <pointLight
          key={k}
          ref={(el) => {
            if (el) {
              el.userData.base = i;
              lights.current[k] = el;
            }
          }}
          position={[x, y, z]}
          color={c}
          intensity={i}
          distance={7}
          decay={1.6}
        />
      ))}
      <spotLight position={[0, 6, 3]} angle={0.7} penumbra={1} intensity={4} color="#ffe6c4" />

      <mesh position={[0, WALL_H / 2, WALL_Z]}>
        <planeGeometry args={[WALL_W, WALL_H]} />
        <meshStandardMaterial map={wallTex} roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}>
        <planeGeometry args={[WALL_W, 12]} />
        {lite ? (
          <meshStandardMaterial color="#141414" roughness={0.6} />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={3}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#151515"
            metalness={0.4}
            mirror={0}
          />
        )}
      </mesh>
    </>
  );
}
