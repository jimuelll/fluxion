'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { WALL_SLOTS, styleAt, styleBySlug } from '@/lib/styles';
import { Tv } from './Tv';
import { Room } from './Room';

// shortcut: coarse pointer or ≤4 cores means "lite"; add drei's PerformanceMonitor if this misjudges real devices.
function detectLite() {
  return matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
}

const FOV = 40;
const HOME_LOOK = new THREE.Vector3(0, 0.9, 0);

/** Camera distance that fits the wall's width (or height) at the current aspect. */
function homePosition(aspect: number, lite: boolean) {
  const halfW = lite ? 1.6 : 3.0;
  const halfH = 1.25;
  const tanV = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const z = Math.max(halfW / (tanV * aspect), halfH / tanV) + 0.6;
  return new THREE.Vector3(0, 0.85, z); // low, like standing in the room
}

type DiveApi = { dive: (index: number, screen: THREE.Mesh) => void };

function Scene({ lite, overlay, returnFrom }: { lite: boolean; overlay: React.RefObject<HTMLDivElement | null>; returnFrom: number | null }) {
  const { camera, size } = useThree();
  const busy = useRef(false);
  const screens = useRef(new Map<number, THREE.Mesh>());
  const pointer = useRef(new THREE.Vector2());
  const home = useMemo(() => homePosition(size.width / size.height, lite), [size, lite]);

  const slots = useMemo(
    () => WALL_SLOTS.map((slot, i) => ({ slot, i })).filter(({ slot }) => !lite || slot.mobile),
    [lite],
  );

  const registerScreen = useCallback((i: number, m: THREE.Mesh) => screens.current.set(i, m), []);

  /** One timeline for both directions: forward dives in and navigates, reversed it pulls back out. */
  const buildTimeline = useCallback(
    (index: number, screen: THREE.Mesh) => {
      const mat = screen.material as THREE.ShaderMaterial;
      const u = mat.uniforms;
      const p = screen.getWorldPosition(new THREE.Vector3());
      const n = new THREE.Vector3(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()));
      const sh = (screen.geometry as THREE.PlaneGeometry).parameters.height;
      const close = p.clone().addScaledVector(n, sh / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      const glass = p.clone().addScaledVector(n, 0.03);
      const from = camera.position.clone();
      const look = HOME_LOOK.clone();
      const k = { a: 0, b: 0 };
      const place = () => {
        camera.position.lerpVectors(from, close, k.a).lerp(glass, k.b);
        camera.lookAt(look.lerpVectors(HOME_LOOK, p, k.a));
      };

      busy.current = true;
      mat.userData.locked = true;
      return gsap
        .timeline({ onUpdate: place, onReverseComplete: () => ((busy.current = false), (mat.userData.locked = false)) })
        .to(k, { a: 1, duration: 1.1, ease: 'power3.inOut' })
        .to(u.uNoise, { value: 0.9, duration: 0.5, ease: 'power1.in' }, 0.75)
        .to(k, { b: 1, duration: 0.45, ease: 'power2.in' }, 1.1)
        .fromTo(u.uFlash, { value: 0 }, { value: 1, duration: 0.25 }, 1.3)
        // fromTo, not to: on return the overlay starts opaque, and reversing a plain .to() would go 1 → 1
        .fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.55);
    },
    [camera, overlay],
  );

  const dive: DiveApi['dive'] = useCallback(
    (index, screen) => {
      const style = styleAt(index);
      if (busy.current || !style) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return location.assign(`/${style.slug}/`);
      buildTimeline(index, screen).eventCallback('onComplete', () => location.assign(`/${style.slug}/`));
    },
    [buildTimeline],
  );

  useEffect(() => {
    camera.position.copy(home);
    camera.lookAt(HOME_LOOK);
    if (returnFrom === null) return;
    const screen = screens.current.get(returnFrom);
    if (!screen) {
      gsap.to(overlay.current, { opacity: 0, duration: 0.4 });
      return;
    }
    const tl = buildTimeline(returnFrom, screen);
    tl.progress(1).timeScale(1.2).reverse();
    return () => void tl.kill();
    // Only on mount: the return plays once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, dt) => {
    if (busy.current) return;
    // Slight drift toward the pointer so the room feels physical.
    pointer.current.lerp(state.pointer, Math.min(1, dt * 2));
    camera.position.set(home.x + pointer.current.x * 0.25, home.y + pointer.current.y * 0.12, home.z);
    camera.lookAt(HOME_LOOK);
  });

  return (
    <>
      <Room lite={lite} />
      {slots.map(({ slot, i }) => (
        <Tv key={i} index={i} slot={slot} style={styleAt(i)} lite={lite} onPick={dive} registerScreen={registerScreen} />
      ))}
    </>
  );
}

export default function Wall() {
  const overlay = useRef<HTMLDivElement>(null);
  const [lite] = useState(detectLite);
  const [returnFrom] = useState(() => {
    const slug = new URLSearchParams(location.search).get('from');
    const slot = slug ? styleBySlug(slug)?.slot : undefined;
    // In lite mode the slot may be hidden; then we just fade in.
    if (slot === undefined || (lite && !WALL_SLOTS[slot].mobile)) return slug ? -1 : null;
    return slot;
  });

  useEffect(() => {
    if (returnFrom !== null) history.replaceState(null, '', '/');
  }, [returnFrom]);

  return (
    <>
      <Canvas
        dpr={lite ? [1, 1.5] : [1, 2]}
        camera={{ fov: FOV, near: 0.01, far: 40 }}
        gl={{ antialias: !lite, powerPreference: 'high-performance' }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <Scene lite={lite} overlay={overlay} returnFrom={returnFrom} />
      </Canvas>
      <div
        ref={overlay}
        aria-hidden
        style={{ position: 'fixed', inset: 0, background: '#000', opacity: returnFrom === null ? 0 : 1, pointerEvents: 'none' }}
      />
    </>
  );
}
