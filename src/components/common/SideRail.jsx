// src/components/common/SideRail.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/common/SideRail.scss";

import { DISASTERS } from "../../app/constants";
import { useAppStore } from "../../app/store";

export default function SideRail({
  // puedes sobreescribir estos callbacks si quieres,
  // pero ya no son obligatorios para navegar
  onDisasterSelect,
  onAction,
  titleTop = "WHAT’S UP",
  titleBottom = "EARTH",
  showWordmark = true,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setActiveDisaster } = useAppStore();

  // cerrar con click fuera / ESC
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleGoHome = () => {
    navigate("/");
    setOpen(false);
    onAction?.("overview");
  };

  const handleSelectDisaster = (disasterKey) => {
    setActiveDisaster(disasterKey);
    navigate(`/stats/${disasterKey}`);
    setOpen(false);
    onDisasterSelect?.(disasterKey);
  };

  const handleAction = (key) => {
    switch (key) {
      case "overview":
        handleGoHome();
        break;
      case "live-globe":
        // de momento, misma navegación que overview
        navigate("/");
        break;
      case "timeline":
      case "bookmarks":
      case "settings":
      case "about":
      default:
        console.log("[SideRail] action:", key);
        break;
    }
    onAction?.(key);
  };

  return (
    <>
      <aside
        className={`siderail ${className}`}
        role="complementary"
        aria-label="Left rail"
      >
        {/* Wordmark (a Home) */}
        {showWordmark && (
          <button
            type="button"
            className="wordmark"
            onClick={handleGoHome}
            aria-label="Go to home"
          >
            <span className="wm-line wm-1">{titleTop} &nbsp; </span>
            <span className="wm-line wm-2">{titleBottom}</span>
          </button>
        )}

        {/* Botón del rail */}
        <button
          className="hamburger rail"
          aria-label="Menu"
          aria-haspopup="menu"
          aria-expanded={open}
          title="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </aside>

      {/* Overlay */}
      <div
        className={`rail-scrim ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Menú lateral */}
      <nav
        ref={menuRef}
        className={`rail-menu ${open ? "open" : ""}`}
        role="menu"
        aria-label="Left rail menu"
      >
        <div className="rail-group">
          <button
            className="rail-item"
            role="menuitem"
            onClick={() => handleAction("overview")}
          >
            Home
          </button>


        </div>

        <div className="rail-sep" />

        <div className="rail-group">
          <div className="rail-label">Disasters</div>
          {DISASTERS.map((d) => (
            <button
              key={d.key}
              className="rail-item"
              role="menuitem"
              onClick={() => handleSelectDisaster(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="rail-sep" />

        <div className="rail-group">

        </div>
      </nav>
    </>
  );
}
