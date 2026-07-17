import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./home.jsx";
import GuidePage from "./guide.jsx";
import Footer, { footerItems } from "./assets/footer.jsx";
import Maps from "./Maps.jsx";
import ProfilPage from "./Profil.jsx";
import Alerts from "./alerts.jsx";

/* --------------------------------------------------------------------------
   ParticleBackground
   - Fixed, full-screen HTML5 canvas behind everything (z-index: 0)
   - pointer-events: none  → clicks pass through to your UI
   - Reacts to the mouse anywhere on the window (repel effect)
   - Pure Canvas 2D + requestAnimationFrame — no libs, no assets
-------------------------------------------------------------------------- */
function ParticleBackground({
  color = "#a12b2b", // red — matches your app accent
  particleCount = 90,
  streakCount = 18,
  speed = 0.4,
  mouseRadius = 140,
  mouseStrength = 1.2,
  glow = 10,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let width = 0,
      height = 0,
      raf = 0;
    const mouse = { x: -9999, y: -9999 };

    function hexToRgba(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();

    // Small twinkling particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 1.8 + 0.6,
      phase: Math.random() * Math.PI * 2,
      pSpeed: 0.015 + Math.random() * 0.03,
    }));

    // "Lightfall" streaks — thin slanted lines falling down
    const streaks = Array.from({ length: streakCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 50 + Math.random() * 120,
      speed: 0.6 + Math.random() * 1.4,
      angle: Math.PI / 2 + (Math.random() - 0.5) * 0.25,
      alpha: 0.08 + Math.random() * 0.22,
    }));

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseOut() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("resize", resize);

    function frame() {
      ctx.clearRect(0, 0, width, height);

      // ---- streaks ----
      streaks.forEach((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.y > height + s.len) {
          s.y = -s.len;
          s.x = Math.random() * width;
        }
        const dx = Math.cos(s.angle) * s.len;
        const dy = Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
        g.addColorStop(0, hexToRgba(color, 0));
        g.addColorStop(0.5, hexToRgba(color, s.alpha));
        g.addColorStop(1, hexToRgba(color, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + dx, s.y + dy);
        ctx.stroke();
      });

      // ---- particles ----
      particles.forEach((p) => {
        // repel from mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < mouseRadius && d > 0.001) {
          const f = (1 - d / mouseRadius) * mouseStrength;
          p.vx += (dx / d) * f * 0.25;
          p.vy += (dy / d) * f * 0.25;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        // wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // twinkle
        p.phase += p.pSpeed;
        const t = (Math.sin(p.phase) + 1) / 2; // 0..1
        const alpha = 0.35 + t * 0.65;

        ctx.shadowBlur = glow;
        ctx.shadowColor = color;
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", resize);
    };
  }, [
    color,
    particleCount,
    streakCount,
    speed,
    mouseRadius,
    mouseStrength,
    glow,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#ffffff", // white BG behind the particles
        pointerEvents: "none", // clicks pass through to UI
        zIndex: 0,
      }}
    />
  );
}

/* -------------------------- Router (unchanged) --------------------------- */
function getCurrentRoute() {
  const path = window.location.pathname;
  const knownRoutes = footerItems.map((item) => item.href);
  return knownRoutes.includes(path) ? path : "/";
}

function Router() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const onPopstate = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", onPopstate);
    return () => window.removeEventListener("popstate", onPopstate);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const page = useMemo(() => {
    switch (route) {
      case "/alerts":
        return <Alerts />;
      case "/map":
        return <Maps />;
      case "/guide":
        return <GuidePage />;
      case "/profile":
        return <ProfilPage />;
      default:
        return <Home />;
    }
  }, [route]);

  return (
    <>
      {/* Particles sit at z-index:0, behind everything, on every route */}
      <ParticleBackground />

      {/* All page content is z-index:1 so it's above the particles */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        {page}
        <Footer onNavigate={handleNavigate} activeHref={route} />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
