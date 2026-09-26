import { useEffect, useRef, useState } from "react";

type V3 = { x: number; y: number; z: number };
type Note = { id: number; text: string; x: number; y: number; px: number; py: number; side: "l" | "r" };

const PERSPECTIVE = 1500;
const MESSAGES = ["egress denied", "read-only fs", "pids 128/128", "NXDOMAIN", "token? none here"];

// Face orientation + how a cube-local point maps onto the face's own 2D plane.
const FACES: {
  key: string;
  uv: (p: V3) => [number, number];
  dist: (p: V3, h: number) => number;
}[] = [
  { key: "front", uv: (p) => [p.x, p.y], dist: (p, h) => h - p.z },
  { key: "back", uv: (p) => [-p.x, p.y], dist: (p, h) => h + p.z },
  { key: "right", uv: (p) => [-p.z, p.y], dist: (p, h) => h - p.x },
  { key: "left", uv: (p) => [p.z, p.y], dist: (p, h) => h + p.x },
  { key: "top", uv: (p) => [p.x, p.z], dist: (p, h) => h + p.y },
  { key: "bottom", uv: (p) => [p.x, -p.z], dist: (p, h) => h - p.y },
];

// Spec chips around the cube. `at` is the chip anchor in units of h from the
// stage centre; `to` is the cube-local point (in units of h) the leader hits.
const SPEC: { k: string; v: string; at: [number, number]; to: V3; side: "l" | "r" }[] = [
  { k: "network", v: "none", at: [-1.72, -1.28], to: { x: 0, y: -1, z: 0 }, side: "l" },
  { k: "backend", v: "gvisor", at: [-1.92, 0.08], to: { x: -1, y: 0, z: 0 }, side: "l" },
  { k: "audit", v: "on", at: [-1.62, 1.42], to: { x: -1, y: 1, z: 1 }, side: "l" },
  { k: "ttl", v: "10m", at: [1.74, -1.3], to: { x: 1, y: -1, z: 1 }, side: "r" },
  { k: "memory", v: "512Mi", at: [1.92, 0.42], to: { x: 0, y: 0.15, z: 1 }, side: "r" },
];

const rad = (d: number) => (d * Math.PI) / 180;

export function GlassCube({ reduced }: { reduced: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rippleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leaderRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const cube = cubeRef.current;
    const orb = orbRef.current;
    if (!stage || !cube || !orb) return;

    let W = 0;
    let H = 0;
    let h = 0;
    let orbR = 0;
    let wide = true;
    const timers: number[] = [];

    const measure = () => {
      const r = stage.getBoundingClientRect();
      W = r.width;
      H = r.height;
      wide = W >= 620;
      const S = wide ? Math.min(W * 0.33, H * 0.44, 300) : Math.min(W * 0.5, H * 0.5);
      h = S / 2;
      orbR = S * 0.085;
      stage.style.setProperty("--s", `${S}px`);
    };
    measure();

    // Simulation state (cube-local px; y points down, z towards the viewer).
    const p: V3 = { x: h * 0.18, y: -h * 0.12, z: h * 0.3 };
    const v: V3 = { x: 0.62, y: 0.41, z: -0.67 };
    let rx = -20;
    let ry = 38;
    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastNote = 0;
    let msg = 0;
    let noteId = 0;

    const rotate = (q: V3) => {
      const cy = Math.cos(rad(ry));
      const sy = Math.sin(rad(ry));
      const cx = Math.cos(rad(rx));
      const sx = Math.sin(rad(rx));
      const x1 = q.x * cy + q.z * sy;
      const z1 = -q.x * sy + q.z * cy;
      const y2 = q.y * cx - z1 * sx;
      const z2 = q.y * sx + z1 * cx;
      return { x: x1, y: y2, z: z2 };
    };
    const project = (q: V3) => {
      const r = rotate(q);
      const k = PERSPECTIVE / (PERSPECTIVE - r.z);
      return { x: W / 2 + r.x * k, y: H / 2 + r.y * k };
    };

    const paint = () => {
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      orb.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${-ry}deg) rotateX(${-rx}deg)`;
      FACES.forEach((f, i) => {
        const g = glowRefs.current[i];
        if (!g) return;
        const [u, w] = f.uv(p);
        const d = Math.max(0, f.dist(p, h) - orbR);
        const k = Math.max(0, 1 - d / (h * 1.5));
        g.style.transform = `translate(${u}px, ${w}px)`;
        g.style.opacity = String(k * k * 0.95);
      });
      if (wide) {
        SPEC.forEach((s, i) => {
          const line = leaderRefs.current[i];
          const dot = dotRefs.current[i];
          if (!line || !dot) return;
          const ax = W / 2 + s.at[0] * h;
          const ay = H / 2 + s.at[1] * h;
          const ex = ax + (s.side === "l" ? 26 : -26);
          const t = project({ x: s.to.x * h, y: s.to.y * h, z: s.to.z * h });
          line.setAttribute("points", `${ax},${ay} ${ex},${ay} ${t.x},${t.y}`);
          dot.setAttribute("cx", String(t.x));
          dot.setAttribute("cy", String(t.y));
        });
      }
    };

    const addNote = (hit: V3, text: string, ttl: number | null) => {
      const pt = project(hit);
      const dx = pt.x - W / 2;
      const dy = pt.y - H / 2;
      const len = Math.hypot(dx, dy) || 1;
      const off = wide ? 46 : 30;
      const est = text.length * 7.2 + 34;
      const side: Note["side"] = dx < 0 ? "l" : "r";
      let x = pt.x + (dx / len) * off;
      x = side === "l" ? Math.max(x, est + 4) : Math.min(x, W - est - 4);
      const note: Note = {
        id: ++noteId,
        text,
        px: pt.x,
        py: pt.y,
        x,
        y: Math.max(16, Math.min(H - 16, pt.y + (dy / len) * off)),
        side,
      };
      setNotes((n) => [...n.slice(-2), note]);
      if (ttl) {
        timers.push(window.setTimeout(() => setNotes((n) => n.filter((x) => x.id !== note.id)), ttl));
      }
    };

    const ripple = (face: number, hit: V3) => {
      const el = rippleRefs.current[face];
      if (!el || typeof el.animate !== "function") return;
      const [u, w] = FACES[face].uv(hit);
      el.animate(
        [
          { transform: `translate(${u}px, ${w}px) scale(0.15)`, opacity: 0.95 },
          { transform: `translate(${u}px, ${w}px) scale(1.5)`, opacity: 0 },
        ],
        { duration: 1100, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
      coreRef.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.82)" }, { transform: "scale(1)" }],
        { duration: 320, easing: "ease-out" },
      );
    };

    if (reduced) {
      const compose = () => {
        measure();
        p.x = h * 0.28;
        p.y = h * 0.1;
        p.z = h * 0.34;
        paint();
        setNotes([]);
        addNote({ x: h * 0.2, y: -h * 0.2, z: h }, "egress denied", null);
        addNote({ x: -h, y: h * 0.25, z: -h * 0.1 }, "read-only fs", null);
      };
      compose();
      const ro = new ResizeObserver(compose);
      ro.observe(stage);
      return () => ro.disconnect();
    }

    const ro = new ResizeObserver(() => {
      const prev = h;
      measure();
      if (prev > 0) {
        const s = h / prev;
        p.x *= s;
        p.y *= s;
        p.z *= s;
      }
      paint();
    });
    ro.observe(stage);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      targetY = nx * 16;
      targetX = -ny * 9;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = 0;
    let visible = true;
    let running = false;

    const step = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      tiltX += (targetX - tiltX) * 0.05;
      tiltY += (targetY - tiltY) * 0.05;
      ry = 38 + Math.sin(now / 5200) * 13 + tiltY;
      rx = -20 + Math.sin(now / 7300) * 4 + tiltX;

      const speed = h * 0.62;
      const b = h - orbR - 2;
      p.x += v.x * speed * dt;
      p.y += v.y * speed * dt;
      p.z += v.z * speed * dt;

      let face = -1;
      let hit: V3 | null = null;
      if (p.x > b) { p.x = b; v.x = -Math.abs(v.x); face = 2; hit = { x: h, y: p.y, z: p.z }; }
      else if (p.x < -b) { p.x = -b; v.x = Math.abs(v.x); face = 3; hit = { x: -h, y: p.y, z: p.z }; }
      if (p.y > b) { p.y = b; v.y = -Math.abs(v.y); face = 5; hit = { x: p.x, y: h, z: p.z }; }
      else if (p.y < -b) { p.y = -b; v.y = Math.abs(v.y); face = 4; hit = { x: p.x, y: -h, z: p.z }; }
      if (p.z > b) { p.z = b; v.z = -Math.abs(v.z); face = 0; hit = { x: p.x, y: p.y, z: h }; }
      else if (p.z < -b) { p.z = -b; v.z = Math.abs(v.z); face = 1; hit = { x: p.x, y: p.y, z: -h }; }

      if (hit && face >= 0) {
        // A little jitter keeps the path from settling into a loop.
        v.x += (Math.random() - 0.5) * 0.35;
        v.y += (Math.random() - 0.5) * 0.35;
        v.z += (Math.random() - 0.5) * 0.35;
        const n = Math.hypot(v.x, v.y, v.z) || 1;
        v.x /= n;
        v.y /= n;
        v.z /= n;
        ripple(face, hit);
        if (now - lastNote > 700) {
          lastNote = now;
          addNote(hit, MESSAGES[msg++ % MESSAGES.length], 1900);
          setBlocked((c) => c + 1);
        }
      }
      paint();
      raf = requestAnimationFrame(step);
    };

    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(stage);
    document.addEventListener("visibilitychange", sync);
    paint();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (fine) window.removeEventListener("pointermove", onMove);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduced]);

  return (
    <div className="cr-stagewrap">
      <div
        className="cr-stage"
        ref={stageRef}
        role="img"
        aria-label="A frosted glass cube with a glowing agent inside. Each time the agent hits a wall it is refused: egress denied, read-only filesystem, pids limit, NXDOMAIN, no token. Sandbox spec: network none, memory 512Mi, ttl 10m, audit on, backend gvisor."
      >
        <div className="cr-stage__grid" aria-hidden="true" />
        <div className="cr-floor" aria-hidden="true">
          <svg className="cr-plinth" viewBox="0 0 400 100" preserveAspectRatio="none">
            <ellipse cx="200" cy="50" rx="198" ry="48" className="cr-plinth__ring" />
            <ellipse cx="200" cy="50" rx="170" ry="40" className="cr-plinth__ticks" />
          </svg>
          <div className="cr-floor__shadow" />
          <div className="cr-floor__caustic" />
        </div>

        <div className="cr-cube" ref={cubeRef} aria-hidden="true">
          {FACES.map((f, i) => (
            <div key={f.key} className={`cr-face cr-face--${f.key}`}>
              <div className="cr-face__glow" ref={(el) => { glowRefs.current[i] = el; }} />
              <div className="cr-face__ripple" ref={(el) => { rippleRefs.current[i] = el; }} />
            </div>
          ))}
          <div className="cr-orb" ref={orbRef}>
            <div className="cr-orb__halo" />
            <div className="cr-orb__core" ref={coreRef} />
            <span className="cr-orb__tag">agent</span>
          </div>
        </div>

        <svg className="cr-leaders" aria-hidden="true">
          {SPEC.map((s, i) => (
            <g key={s.k}>
              <polyline ref={(el) => { leaderRefs.current[i] = el; }} className="cr-leader" />
              <circle ref={(el) => { dotRefs.current[i] = el; }} r="3.2" className="cr-leader__dot" />
            </g>
          ))}
          {notes.map((n) => (
            <line
              key={n.id}
              x1={n.px}
              y1={n.py}
              x2={n.x}
              y2={n.y}
              className={`cr-hitline ${reduced ? "is-static" : ""}`}
            />
          ))}
        </svg>

        <div className="cr-specs" aria-hidden="true">
          {SPEC.map((s, i) => (
            <span
              key={s.k}
              className={`cr-spec cr-spec--${s.side}`}
              style={{
                left: `calc(50% + var(--s) * ${s.at[0] / 2})`,
                top: `calc(50% + var(--s) * ${s.at[1] / 2})`,
              }}
            >
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{s.k}</span>
              <em>{s.v}</em>
            </span>
          ))}
        </div>

        <div className="cr-notes" aria-hidden="true">
          {notes.map((n) => (
            <span
              key={n.id}
              className={`cr-note cr-note--${n.side} ${reduced ? "is-static" : ""}`}
              style={{ left: n.x, top: n.y }}
            >
              <i />
              {n.text}
            </span>
          ))}
        </div>
      </div>

      <div className="cr-readout" aria-hidden="true">
        <span className="cr-readout__id">sbx_01M2NVHE1KRD8JT3D6QG6R0EW3</span>
        <span className="cr-readout__state"><i /> running</span>
        <span>refused <b>{String(reduced ? 2 : blocked).padStart(3, "0")}</b></span>
        <span>host <b>untouched</b></span>
      </div>
    </div>
  );
}
