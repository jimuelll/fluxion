import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uNoise;  // 0 = clean picture, 1 = pure static
  uniform float uFlash;  // 0..1 white-out at the end of a dive
  uniform float uLite;   // 1 = cheap path for mobile / low power
  uniform float uDim;    // 0 = on air, 1 = resting: darker picture, slower calmer static
  uniform float uSeed;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    if (uLite < 0.5) uv *= 1.0 + 0.07 * dot(uv, uv); // curved glass
    uv = uv * 0.5 + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float t = uTime + uSeed;
    // line jitter that grows while the channel tunes in
    uv.x += (hash(vec2(floor(uv.y * 90.0), floor(t * 24.0))) - 0.5) * 0.04 * uNoise * uNoise;

    vec3 col;
    if (uLite < 0.5) {
      float s = 0.0015 + 0.006 * uNoise; // RGB split
      col = vec3(texture2D(uMap, uv + vec2(s, 0.0)).r, texture2D(uMap, uv).g, texture2D(uMap, uv - vec2(s, 0.0)).b);
    } else {
      col = texture2D(uMap, uv).rgb;
    }

    // Static re-rolls in steps; resting screens step slowly so a wall of them doesn't strobe.
    float n = hash(floor(uv * vec2(320.0, 240.0)) + floor(t * mix(24.0, 6.0, uDim)) * 0.731);
    col = mix(col, vec3(n), 0.07 + 0.88 * uNoise);
    col *= 0.88 + 0.12 * sin(uv.y * 240.0 * 3.14159);              // scanlines
    col *= 1.0 - 0.06 * (1.0 - uDim) * hash(vec2(floor(t * 30.0), uSeed)) * (0.3 + uNoise); // flicker, off when resting
    vec2 v = uv * (1.0 - uv);
    col *= pow(clamp(v.x * v.y * 18.0, 0.0, 1.0), 0.3);            // vignette
    col *= mix(1.25, 0.7, uDim);
    col = mix(col, vec3(1.0), uFlash);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createCrtMaterial(map: THREE.Texture, lite: boolean, seed: number) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    toneMapped: false,
    uniforms: {
      uMap: { value: map },
      uTime: { value: 0 },
      uNoise: { value: 0 },
      uFlash: { value: 0 },
      uLite: { value: lite ? 1 : 0 },
      uDim: { value: 1 },
      uSeed: { value: seed },
    },
  });
}

/** Canvas texture for TVs without a recorded preview: a test card, or NO SIGNAL for empty slots. */
export function createCardTexture(label: string | null) {
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = 240;
  const g = c.getContext('2d')!;
  if (label) {
    const bars = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    bars.forEach((b, i) => {
      g.fillStyle = b;
      g.fillRect((i * c.width) / bars.length, 0, c.width / bars.length + 1, 170);
    });
    g.fillStyle = '#111';
    g.fillRect(0, 170, c.width, 70);
    g.fillStyle = '#fff';
    g.font = 'bold 26px monospace';
    g.textAlign = 'center';
    g.fillText(label.toUpperCase(), c.width / 2, 215);
  } else {
    g.fillStyle = '#0a0a40';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#ddd';
    g.font = 'bold 28px monospace';
    g.textAlign = 'center';
    g.fillText('NO SIGNAL', c.width / 2, c.height / 2 + 10);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Muted looping preview video as a texture. Starts paused; the wall decides which TV is on air. */
export function createVideoTexture(basename: string) {
  const v = document.createElement('video');
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.crossOrigin = 'anonymous';
  v.preload = 'auto';
  for (const [ext, type] of [['webm', 'video/webm'], ['mp4', 'video/mp4']]) {
    const s = document.createElement('source');
    s.src = `/previews/${basename}.${ext}`;
    s.type = type;
    v.appendChild(s);
  }
  const tex = new THREE.VideoTexture(v);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
