import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// IMPORTANTE: asegúrate de tener instalado react-globe.gl y three
// npm i react-globe.gl three
let GlobeComp = null;
try {
  // carga perezosa para evitar errores en entornos sin WebGL en el primer render
  GlobeComp = require("react-globe.gl").default;
} catch (_) {
  GlobeComp = null;
}

function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return size;
}

export default function GlobeHero() {
  const wrapRef = useRef(null);
  const { w, h } = useSize(wrapRef);
  const globeRef = useRef();
  const [webglOk, setWebglOk] = useState(true);

  // Test rápido de WebGL
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
  }, []);

  // Centrado/controles cuando ya existe el canvas
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    try {
      g.controls().enableZoom = false;
      g.pointOfView({ lat: 20, lng: -20, altitude: 2 }, 1200);
    } catch {
      /* no-op */
    }
  }, [w, h]);

  // Si la lib no está disponible o no hay WebGL, usa imagen fallback
  const showFallback = !GlobeComp || !webglOk;

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      {showFallback ? (
        <img
          src="/assets/earth-hero.jpg" // pon esta imagen en public/assets/earth-hero.jpg
          alt="Earth"
          style={{ width: "100%", height: "100%", borderRadius: "999px", objectFit: "cover" }}
          draggable={false}
        />
      ) : (
        <GlobeComp
          ref={globeRef}
          width={w}
          height={h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/textures/earth-day.jpg"   // Asegúrate que existan
          bumpImageUrl="/textures/earth-bump.jpg"   // public/textures/earth-bump.jpg
          showAtmosphere
          atmosphereAltitude={0.18}
        />
      )}
    </div>
  );
}
