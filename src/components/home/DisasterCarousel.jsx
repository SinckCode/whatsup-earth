// src/components/home/DisasterCarousel.jsx
import React, { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DISASTERS } from "../../app/constants";
import { useAppStore } from "../../app/store";
import DisasterSlide from "./DisasterSlide";

export default function DisasterCarousel() {
  const scrollerRef = useRef(null);
  const nav = useNavigate();
  const { setActiveDisaster } = useAppStore();

  const slides = useMemo(() => DISASTERS, []);

  const goStats = (key) => {
    setActiveDisaster(key);
    nav(`/stats/${key}`);
  };

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.min(el.scrollTop + el.clientHeight, el.scrollHeight);
    el.scrollTo({ top: next, behavior: "smooth" });
  };

  return (
    <div className="slides" ref={scrollerRef}>
      {slides.map((d, idx) => (
        <DisasterSlide
          key={d.key}
          bg={d.bg}
          title={d.label}
          onOpenStats={() => goStats(d.key)}
          onNext={() => {
            if (idx < slides.length - 1) scrollNext();
            else elToTop(scrollerRef.current);
          }}
        />
      ))}
    </div>
  );
}

function elToTop(el) {
  if (!el) return;
  el.scrollTo({ top: 0, behavior: "smooth" });
}
