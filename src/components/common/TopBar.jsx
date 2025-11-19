// src/components/common/TopBar.jsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../../public/vite.svg"; // o "/vite.svg"
import "../../styles/components/common/TopBar.scss";

import { DISASTERS } from "../../app/constants";
import { useAppStore } from "../../app/store";

/* Panel de desastres para Add / Analytics */
const DisasterPanel = forwardRef(function DisasterPanel(
  { onSelect, className, title },
  ref
) {
  return (
    <div
      ref={ref}
      className={className}
      role="menu"
      aria-label={title || "Disaster menu"}
    >
      {DISASTERS.map((it) => (
        <button
          key={it.key}
          className="add-item"
          role="menuitem"
          onClick={() => onSelect?.(it.key)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
});

/* Popover de búsqueda */
const SearchPopover = forwardRef(function SearchPopover({ onSubmit }, ref) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div ref={ref} className="search-pop" role="dialog" aria-label="Search">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = inputRef.current?.value?.trim() || "";
          onSubmit?.(q);
        }}
      >
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Search events, places…"
          aria-label="Search query"
        />
      </form>
    </div>
  );
});

export default function TopBar({
  title = "WHAT’S UP EARTH?",
  onMenu = () => {},
  onAnalytics = () => {},
  onSearch = (q) => console.log("[TopBar] search:", q),
  onAddSelect,
  onAnalyticsSelect,
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const addBtnRef = useRef(null);
  const statsBtnRef = useRef(null);
  const searchBtnRef = useRef(null);

  const addPanelRef = useRef(null);
  const statsPanelRef = useRef(null);
  const searchPanelRef = useRef(null);

  const navigate = useNavigate();
  const { setActiveDisaster } = useAppStore();

  const openOnly = (which) => {
    setOpenAdd(which === "add");
    setOpenStats(which === "stats");
    setOpenSearch(which === "search");
  };

  // cerrar popovers con click-fuera / ESC
  useEffect(() => {
    const onDown = (e) => {
      const t = e.target;
      const nodes = [
        addBtnRef.current,
        addPanelRef.current,
        statsBtnRef.current,
        statsPanelRef.current,
        searchBtnRef.current,
        searchPanelRef.current,
      ].filter(Boolean);
      if (nodes.every((n) => !n.contains(t))) openOnly(null);
    };
    const onKey = (e) => e.key === "Escape" && openOnly(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogoClick = () => {
    navigate("/");
    onMenu();
  };

  const goToStats = (disasterKey) => {
    setActiveDisaster(disasterKey);
    navigate(`/stats/${disasterKey}`);
  };

  const handleAddSelect = (k) => {
    goToStats(k);
    onAddSelect?.(k);
  };

  const handleAnalyticsSelect = (k) => {
    onAnalytics();
    goToStats(k);
    onAnalyticsSelect?.(k);
  };

  return (
    <header className="topbar" role="banner">
      {/* Marca / Logo → Home */}
      <button
        type="button"
        className="brand"
        onClick={handleLogoClick}
        aria-label="Go to home"
      >
        <img src={logoUrl} className="brand-logo" alt="Logo" />
        <span className="brand-title">{title}</span>
      </button>

      <div className="actions">
        {/* ＋  Add */}


        {/* Analytics */}
        <button
          ref={statsBtnRef}
          className="pill"
          aria-haspopup="menu"
          aria-expanded={openStats}
          aria-label="Analytics"
          title="See stats by disaster"
          onClick={() => {
            onAnalytics();
            openOnly(openStats ? null : "stats");
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 13v7M10 4v16M16 9v11M22 2v20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        

        {/* Panels flotantes */}


        {openStats && (
          <DisasterPanel
            ref={statsPanelRef}
            className="stats-panel"
            title="Analytics by disaster"
            onSelect={(k) => {
              handleAnalyticsSelect(k);
              openOnly(null);
            }}
          />
        )}


      </div>
    </header>
  );
}
