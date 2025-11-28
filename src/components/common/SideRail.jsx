// src/components/common/SideRail.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/common/SideRail.scss";

import { DISASTERS } from "../../app/constants";
import { useAppStore } from "../../app/store";
import { useAuth } from "../../app/AuthContext";

export default function SideRail({
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

  const { isAuthenticated, user, logout } = useAuth();

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
        navigate("/");
        setOpen(false);
        break;

      case "login":
        navigate("/login");
        setOpen(false);
        break;

      case "register":
        navigate("/register");
        setOpen(false);
        break;

      case "account":
        navigate("/account");
        setOpen(false);
        break;

      case "favorites":
        navigate("/favorites");
        setOpen(false);
        break;

      case "saved-views":
        navigate("/saved-views");
        setOpen(false);
        break;

      case "logout":
        logout();
        navigate("/", { replace: true });
        setOpen(false);
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

  const shortName = user?.name?.split(" ")[0] || "explorer";

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

        {/* Grupo de cuenta / auth */}
        <div className="rail-group">
          <div className="rail-label">Account</div>

          {!isAuthenticated && (
            <>
              <button
                className="rail-item"
                role="menuitem"
                onClick={() => handleAction("login")}
              >
                Iniciar sesión
              </button>
              <button
                className="rail-item"
                role="menuitem"
                onClick={() => handleAction("register")}
              >
                Crear cuenta
              </button>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="rail-user">
                <span className="rail-user__avatar">
                  {shortName.charAt(0).toUpperCase()}
                </span>
                <div className="rail-user__info">
                  <span className="rail-user__name">{shortName}</span>
                  <span className="rail-user__mail">
                    {user.email || ""}
                  </span>
                </div>
              </div>

              <button
                className="rail-item"
                role="menuitem"
                onClick={() => handleAction("account")}
              >
                Mi cuenta
              </button>
              <button
                className="rail-item"
                role="menuitem"
                onClick={() => handleAction("favorites")}
              >
                Favoritos
              </button>
              <button
                className="rail-item"
                role="menuitem"
                onClick={() => handleAction("saved-views")}
              >
                Vistas guardadas
              </button>

              <div className="rail-sep" />

              <button
                className="rail-item rail-item--danger"
                role="menuitem"
                onClick={() => handleAction("logout")}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
