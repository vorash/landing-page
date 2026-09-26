import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// A cheap 2D approximation of a lensed black hole: warped starfield, the far
// side of the disk bent into a halo, the shadow, the near side of the disk in
// front of it, and a photon ring. Differential rotation (w ~ r^-1.5) and
// Doppler beaming (approaching side brighter) sell the physics.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_time;
uniform vec2 u_tilt;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
float stars(vec2 p) {
  vec2 g = floor(p), f = fract(p);
  float h = hash(g);
  float s = step(0.965, h);
  vec2 o = vec2(hash(g + 3.1), hash(g + 7.7)) * 0.8 + 0.1;
  float d = length(f - o);
  return s * smoothstep(0.08, 0.0, d) * (0.4 + 0.6 * hash(g + 1.3));
}

// Disk texture in polar coords, seamless in angle.
float swirl(float r, float ang, float t) {
  float w = 0.55 * pow(max(r, 0.3), -1.5);
  float a = ang + t * w;
  vec2 q = vec2(cos(a), sin(a)) * (1.6 + r * 1.3);
  float n = fbm(q * 1.7 + vec2(r * 5.0, 0.0));
  float streak = fbm(vec2(r * 22.0, 0.0) + q * 0.45);
  return n * 0.75 + streak * 0.55;
}

vec3 heat(float x) {
  vec3 deep = vec3(0.55, 0.07, 0.02);
  vec3 amber = vec3(1.0, 0.42, 0.10);
  vec3 hot = vec3(1.0, 0.86, 0.62);
  return x < 0.5 ? mix(deep, amber, x * 2.0) : mix(amber, hot, (x - 0.5) * 2.0);
}

void main() {
  vec2 p = (gl_FragCoord.xy - u_center) / u_radius;
  float r = length(p);
  vec3 col = vec3(0.0);
  float t = u_time;

  // Lensed background: pull the starfield outward around the hole.
  vec2 lp = p * (1.0 + 1.35 / max(r * r, 0.2));
  vec2 sp = (lp * u_radius + u_center) / 3.2;
  col += vec3(1.0, 0.92, 0.85) * stars(sp) * 0.9;
  col += vec3(0.85, 0.9, 1.0) * stars(sp * 0.53 + 11.0) * 0.6;
  float neb = fbm(lp * 0.35 + vec2(t * 0.004, 0.0));
  col += vec3(0.16, 0.05, 0.02) * pow(neb, 3.0) * 0.9;

  float shadow = 1.0;
  float rs = 1.0;

  // Far side of the disk, lensed into a halo that arcs over and under.
  float halo = smoothstep(rs * 0.98, rs * 1.06, r) * (1.0 - smoothstep(rs * 1.18, rs * 1.85, r));
  float hang = atan(p.y, p.x);
  float hs = swirl(r * 1.4, hang * 1.0, t * 0.9);
  float vert = (0.35 + 0.65 * abs(p.y / max(r, 0.001))) * (p.y > 0.0 ? 1.0 : 0.62);
  float dopH = 1.0 - 0.55 * (p.x / max(r, 0.001));
  col += heat(clamp(hs * 0.85, 0.0, 1.0)) * halo * vert * dopH * 1.35;

  // Shadow.
  float inShadow = 1.0 - smoothstep(rs * 0.97, rs * 1.0, r);
  col *= 1.0 - inShadow;

  // Photon ring.
  float ring = exp(-abs(r - rs * 1.035) * 60.0);
  col += vec3(1.0, 0.8, 0.55) * ring * 0.9;

  // Thin tilted disk. Near half draws over the shadow, far half is hidden by it.
  vec2 dp = vec2(p.x, (p.y - u_tilt.y) / u_tilt.x);
  float dr = length(dp);
  float band = smoothstep(1.1, 1.3, dr) * (1.0 - smoothstep(2.6, 5.8, dr));
  float nearSide = step(p.y, u_tilt.y);
  float visible = mix(1.0 - inShadow, 1.0, nearSide);
  float ds = swirl(dr, atan(dp.y, dp.x), t);
  float fall = pow(1.3 / max(dr, 1.3), 2.0);
  float dop = 1.0 - 0.6 * (dp.x / max(dr, 0.001));
  float disk = band * visible;
  col += heat(clamp(ds * fall * 1.25 + 0.1, 0.0, 1.0)) * disk * dop * (0.8 + fall * 1.8);

  // Soft glow, grain, tone map.
  col += vec3(1.0, 0.45, 0.15) * exp(-max(r - 1.0, 0.0) * 2.2) * 0.06 * (1.0 - inShadow);
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.025;
  col = 1.0 - exp(-col * 1.35);
  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  reduced: boolean;
  className?: string;
  // Where the hole sits, as fractions of the canvas box, and its size in vmin.
  anchor?: { x: number; y: number; size: number };
};

export function BlackHole({ reduced, className, anchor = { x: 0.5, y: 0.42, size: 0.13 } }: Props) {
  const glRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = glRef.current;
    const fx = fxRef.current;
    if (!canvas || !fx) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    const ctx = fx.getContext("2d");
    if (!gl || !ctx) {
      canvas.classList.add("is-fallback");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uCenter = gl.getUniformLocation(prog, "u_center");
    const uRadius = gl.getUniformLocation(prog, "u_radius");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uTilt = gl.getUniformLocation(prog, "u_tilt");

    let w = 0;
    let h = 0;
    let scale = 1;
    let cx = 0;
    let cy = 0;
    let rad = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      scale = Math.min(window.devicePixelRatio || 1, 1.25) * (w > 1400 ? 0.8 : 1);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      fx.width = Math.round(w * dpr);
      fx.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 720;
      cx = w * anchor.x;
      cy = h * (mobile ? anchor.y - 0.06 : anchor.y);
      rad = Math.min(w, h) * (mobile ? anchor.size * 1.25 : anchor.size);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Infalling hostile commands.
    const WORDS = [
      "rm -rf /", ":(){ :|:& };:", "curl 169.254.169.254", "cat ~/.aws/credentials",
      "nc -e /bin/sh", "echo $GITHUB_TOKEN", "mount /dev/sda1", "ptrace(PTRACE_ATTACH)",
      "dd if=/dev/zero", "chmod 4755 /bin/sh", "nslookup x.exfil.io", "kill -9 -1",
      "insmod rootkit.ko", "while True: fork()", "scp ~/.ssh/id_ed25519",
    ];
    type P = { word: string; r: number; a: number; v: number; life: number };
    const parts: P[] = [];
    const spawn = (initial = false): P => ({
      word: WORDS[(Math.random() * WORDS.length) | 0],
      r: initial ? 1.6 + Math.random() * 3.6 : 4.6 + Math.random() * 1.4,
      a: Math.random() * Math.PI * 2,
      v: 0.012 + Math.random() * 0.01,
      life: 0,
    });
    const COUNT = w < 720 ? 7 : 13;
    for (let i = 0; i < COUNT; i++) parts.push(spawn(true));

    let swallowed = 0;
    const counter = document.querySelector<HTMLElement>("[data-swallowed]");

    let raf = 0;
    let running = true;
    let last = performance.now();
    let time = 12;

    const drawFx = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += dt;
        p.v *= 1 + dt * 0.9;
        p.r -= p.v * dt * 60 * (1.2 / Math.max(p.r, 0.9));
        p.a += dt * 0.55 * Math.pow(Math.max(p.r, 1), -1.5);
        if (p.r < 1.08) {
          swallowed++;
          if (counter) counter.textContent = swallowed.toLocaleString("en-US");
          parts[i] = spawn();
          continue;
        }
        const x = cx + Math.cos(p.a) * p.r * rad * 1.1;
        const y = cy + Math.sin(p.a) * p.r * rad * 0.2;
        const behind = Math.sin(p.a) < 0 && Math.hypot(x - cx, (y - cy) * 1.1) < rad * 1.02;
        if (behind) continue;
        const near = Math.min(1, Math.max(0, (p.r - 1.08) / 2.2));
        const fadeIn = Math.min(1, p.life / 1.2);
        const size = 9 + 5 * near;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(0.35 + 0.65 * near, 1);
        ctx.font = `500 ${size}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.fillStyle = `rgba(255, ${Math.round(150 + 80 * near)}, ${Math.round(90 + 110 * near)}, ${0.55 * fadeIn * (0.25 + 0.75 * near)})`;
        ctx.fillText(p.word, 0, 0);
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uCenter, (cx + mouse.x * 10) * scale, (h - cy - mouse.y * 6) * scale);
      gl.uniform1f(uRadius, rad * scale);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uTilt, 0.085 + mouse.y * 0.02, mouse.y * 0.03);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) drawFx(dt);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting && !document.hidden;
      if (vis && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) requestAnimationFrame(frame);
    });
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced, anchor.x, anchor.y, anchor.size]);

  return (
    <div className={className}>
      <canvas ref={glRef} className="hz-bh" />
      <canvas ref={fxRef} className="hz-fx" />
    </div>
  );
}
