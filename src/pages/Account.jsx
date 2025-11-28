// src/pages/Account.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import UserAreaNav from "../components/account/UserAreaNav";
import { useUpdateMe } from "../hooks/useUpdateMe"; // 🔥 hook que habla con /api/users/me y /api/users/me/preferences
import "../styles/components/account/_accountPage.scss";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="account-page account-page--no-user">
        <div className="account-page__inner">
          <h1 className="account-page__title">Mi cuenta</h1>
          <p className="account-page__subtitle">
            No hay información de usuario. Vuelve a iniciar sesión.
          </p>
        </div>
      </div>
    );
  }

  const { email, name, country, role, preferences = {} } = user;
  const shortName = name?.split(" ")[0] || "explorer";

  // Estado local del formulario de edición
  const [editForm, setEditForm] = useState({
    name: name || "",
    country: country || "",
    theme: preferences.theme || "dark",
    defaultCategory: preferences.defaultCategory || "wildfires",
    defaultView: preferences.defaultView || "stats",
    defaultTimeRange: preferences.defaultTimeRange || "30d",
  });

  // Hook real conectado a:
  //  - PATCH /api/users/me            → name, country
  //  - PATCH /api/users/me/preferences → preferencias
  const {
    mutate: updateProfile,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateMe();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Rol “admin” para mostrar el menú de backend
  const isAdmin = ["admin", "superadmin", "root"].includes(
    String(role).toLowerCase()
  );

  const backendSections = [
    {
      key: "dashboard",
      label: "Dashboard",
      description: "Resumen general del sistema",
      path: "/backend",
    },
    {
      key: "users",
      label: "Usuarios",
      description: "Gestión de usuarios y roles",
      path: "/backend/users",
    },
    {
      key: "events",
      label: "Eventos",
      description: "Eventos EONET / datos procesados",
      path: "/backend/events",
    },
    {
      key: "logs",
      label: "Registros",
      description: "Logs de sistema y actividad",
      path: "/backend/logs",
    },
    {
      key: "settings",
      label: "Ajustes",
      description: "Configuración avanzada",
      path: "/backend/settings",
    },
  ];

  const goTo = (path) => navigate(path);

  const handleOpenEdit = () => {
    // Re-sincronizar por si el usuario cambió desde otro lado
    setEditForm({
      name: user.name || "",
      country: user.country || "",
      theme: user.preferences?.theme || "dark",
      defaultCategory: user.preferences?.defaultCategory || "wildfires",
      defaultView: user.preferences?.defaultView || "stats",
      defaultTimeRange: user.preferences?.defaultTimeRange || "30d",
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    if (isUpdating) return; // evita cerrar mientras guarda
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: editForm.name,
      country: editForm.country,
      preferences: {
        theme: editForm.theme,
        defaultCategory: editForm.defaultCategory,
        defaultView: editForm.defaultView,
        defaultTimeRange: editForm.defaultTimeRange,
      },
    };

    // 🔥 Este payload lo consume useUpdateMe:
    //  - manda { name, country } a /api/users/me
    //  - manda { ...preferences } a /api/users/me/preferences
    updateProfile(payload, {
      onSuccess: () => {
        setShowEditModal(false);
      },
      // onError ya lo captura updateError
    });
  };

  return (
    <div className="account-page">
      <div className="account-page__inner">
        {/* Header */}
        <header className="account-page__header">
          <div>
            <p className="account-page__eyebrow">Cuenta</p>
            <h1 className="account-page__title">
              Hola, <span>{shortName}</span>
            </h1>
            <p className="account-page__subtitle">
              Administra tu perfil y tus preferencias de What's Up Earth?.
            </p>
          </div>

          <button
            type="button"
            className="account-page__logout-btn"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </header>

        {/* Menú de área de usuario (Account / Favorites / Saved Views / Backend) */}
        <UserAreaNav />

        {/* Grid principal */}
        <div className="account-page__grid">
          {/* Card: info general */}
          <section className="account-card account-card--profile">
            <div className="account-card__header">
              <div className="account-card__avatar">
                {shortName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="account-card__title">Información general</h2>
                <p className="account-card__subtitle">
                  Datos básicos de tu cuenta
                </p>
              </div>
            </div>

            <dl className="account-card__list">
              <div className="account-card__row">
                <dt>Nombre</dt>
                <dd>{name || "—"}</dd>
              </div>
              <div className="account-card__row">
                <dt>Email</dt>
                <dd>{email || "—"}</dd>
              </div>
              <div className="account-card__row">
                <dt>País</dt>
                <dd>{country || "—"}</dd>
              </div>
              <div className="account-card__row">
                <dt>Rol</dt>
                <dd>
                  <span className="account-badge account-badge--role">
                    {role || "user"}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="account-card__footer">
              <button
                type="button"
                className="account-actions__btn account-actions__btn--secondary"
                onClick={handleOpenEdit}
              >
                Editar perfil
              </button>
            </div>
          </section>

          {/* Card: preferencias */}
          <section className="account-card account-card--preferences">
            <div className="account-card__header">
              <div>
                <h2 className="account-card__title">Preferencias</h2>
                <p className="account-card__subtitle">
                  Ajustes por defecto para tu experiencia
                </p>
              </div>
            </div>

            <div className="account-preferences">
              <div className="account-preferences__item">
                <span className="account-preferences__label">Tema</span>
                <span className="account-chip">
                  {preferences.theme || "dark"}
                </span>
              </div>

              <div className="account-preferences__item">
                <span className="account-preferences__label">
                  Categoría por defecto
                </span>
                <span className="account-chip">
                  {preferences.defaultCategory || "wildfires"}
                </span>
              </div>

              <div className="account-preferences__item">
                <span className="account-preferences__label">
                  Vista inicial
                </span>
                <span className="account-chip">
                  {preferences.defaultView || "stats"}
                </span>
              </div>

              <div className="account-preferences__item">
                <span className="account-preferences__label">
                  Rango de tiempo
                </span>
                <span className="account-chip">
                  {preferences.defaultTimeRange || "30d"}
                </span>
              </div>
            </div>
          </section>

          {/* Card: Acciones rápidas frontend */}
          <section className="account-card account-card--actions">
            <div className="account-card__header">
              <div>
                <h2 className="account-card__title">Acciones rápidas</h2>
                <p className="account-card__subtitle">
                  Navega a tus secciones favoritas
                </p>
              </div>
            </div>

            <div className="account-actions">
              <button
                type="button"
                className="account-actions__btn account-actions__btn--primary"
                onClick={() => goTo("/saved-views")}
              >
                Ver vistas guardadas
              </button>

              <button
                type="button"
                className="account-actions__btn account-actions__btn--ghost"
                onClick={() => goTo("/favorites")}
              >
                Ver favoritos
              </button>

              <button
                type="button"
                className="account-actions__btn account-actions__btn--ghost"
                onClick={() => goTo("/")}
              >
                Ir al Home
              </button>
            </div>
          </section>

          {/* Card: menú backend (solo admin) */}
          {isAdmin && (
            <section className="account-card account-card--backend">
              <div className="account-card__header">
                <div>
                  <h2 className="account-card__title">Panel backend</h2>
                  <p className="account-card__subtitle">
                    Herramientas internas para administrar datos y servicios.
                  </p>
                </div>
                <span className="account-badge account-badge--admin">
                  Admin
                </span>
              </div>

              <div className="backend-menu">
                {backendSections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    className="backend-menu__item"
                    onClick={() => goTo(section.path)}
                  >
                    <div className="backend-menu__label">
                      <span>{section.label}</span>
                      <small>{section.description}</small>
                    </div>
                    <span className="backend-menu__chevron">›</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {showEditModal && (
        <div className="account-modal">
          <div className="account-modal__backdrop" onClick={handleCloseEdit} />
          <div className="account-modal__dialog">
            <header className="account-modal__header">
              <div>
                <h2 className="account-modal__title">Editar perfil</h2>
                <p className="account-modal__subtitle">
                  Actualiza tu nombre, país y preferencias por defecto.
                </p>
              </div>
              <button
                type="button"
                className="account-modal__close"
                onClick={handleCloseEdit}
                disabled={isUpdating}
              >
                ✕
              </button>
            </header>

            {updateError && (
              <p className="account-modal__error">
                {updateError.message || "No se pudo actualizar tu perfil."}
              </p>
            )}

            <form className="account-modal__form" onSubmit={handleEditSubmit}>
              <div className="account-modal__row">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label>
                  País
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleEditChange}
                    placeholder="México"
                  />
                </label>
              </div>

              <div className="account-modal__group">
                <p className="account-modal__group-title">Preferencias</p>

                <div className="account-modal__row">
                  <label>
                    Tema
                    <select
                      name="theme"
                      value={editForm.theme}
                      onChange={handleEditChange}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </label>

                  <label>
                    Categoría por defecto
                    <select
                      name="defaultCategory"
                      value={editForm.defaultCategory}
                      onChange={handleEditChange}
                    >
                      <option value="wildfires">Wildfires</option>
                      <option value="earthquakes">Earthquakes</option>
                      <option value="storms">Storms</option>
                      <option value="dustHaze">Dust &amp; Haze</option>
                    </select>
                  </label>
                </div>

                <div className="account-modal__row">
                  <label>
                    Vista inicial
                    <select
                      name="defaultView"
                      value={editForm.defaultView}
                      onChange={handleEditChange}
                    >
                      <option value="stats">Estadísticas</option>
                      <option value="map">Mapa</option>
                      <option value="timeline">Timeline</option>
                    </select>
                  </label>

                  <label>
                    Rango de tiempo por defecto
                    <input
                      type="text"
                      name="defaultTimeRange"
                      value={editForm.defaultTimeRange}
                      onChange={handleEditChange}
                      placeholder="30d"
                    />
                  </label>
                </div>
              </div>

              <div className="account-modal__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={handleCloseEdit}
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
