// Home.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import SideRail from "../components/common/SideRail";
import GlobeHero from "../components/GlobeHero.jsx";
import DisasterCarousel from "../components/home/DisasterCarousel.jsx";

export default function Home() {
  const heroRef = useRef(null);
  const slidesSectionRef = useRef(null);
  const navigate = useNavigate();

  // 🔗 cuando el usuario elige un desastre en el carrusel
  const handleDisasterSelect = (themeKey) => {
    // ejemplos de themeKey: "wildfires", "severeStorms", "volcanoes"
    navigate(`/stats?theme=${themeKey}`);
  };

  // 1) Desde el HERO: si se scrollea hacia abajo, "salta" al carrusel
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const onWheelFromHero = (e) => {
      if (e.deltaY > 8) {
        e.preventDefault();
        slidesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    heroEl.addEventListener("wheel", onWheelFromHero, { passive: false });
    return () => heroEl.removeEventListener("wheel", onWheelFromHero);
  }, []);

  // 2) En el carrusel: mapear rueda vertical → scroll horizontal + snap
  useEffect(() => {
    const section = slidesSectionRef.current;
    if (!section) return;

    const track =
      section.querySelector(".slides") ||
      section;

    const onWheelToHorizontal = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };

    track.addEventListener("wheel", onWheelToHorizontal, { passive: false });
    return () => track.removeEventListener("wheel", onWheelToHorizontal);
  }, []);

  // 3) Activar transición entre slides
  useEffect(() => {
    const section = slidesSectionRef.current;
    if (!section) return;

    const root = section.querySelector(".slides") || section;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && en.intersectionRatio >= 0.55) {
            en.target.setAttribute("data-active", "true");
          } else {
            en.target.removeAttribute("data-active");
          }
        });
      },
      { root, threshold: [0.55] }
    );

    root.querySelectorAll(".slide").forEach((slide) => io.observe(slide));
    return () => io.disconnect();
  }, []);

  return (
    <main className="home">
      <TopBar />
      <SideRail />

      {/* Sección 1: H E R O con globo */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-planet">
          <GlobeHero />
        </div>
      </section>

      {/* Sección 2: C A R R U S E L de desastres */}
      <section ref={slidesSectionRef} className="slides-section">
        {/* 🔗 le pasamos el callback */}
        <DisasterCarousel onSelectDisaster={handleDisasterSelect} />
      </section>
    </main>
  );
}
