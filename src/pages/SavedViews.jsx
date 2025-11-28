// src/pages/SavedViewsPage.jsx
import React, { useState } from "react";
import { useAuth } from "../app/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSavedViews,
  createSavedView,
  deleteSavedView,
} from "../api/savedViewsApi";
import { useNavigate } from "react-router-dom";
import UserAreaNav from "../components/account/UserAreaNav";
import "../styles/pages/SavedViewsPage.scss";

export default function SavedViewsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "wildfires",
    country: "Mexico",
    dateType: "lastDays",
    dateValue: 30,
    severityMin: "",
    severityMax: "",
  });

  // Si por alguna razón se llega sin token (no debería, está protegida),
  // mostramos un mensaje amigable.
  if (!token) {
    return (
      <div className="page page--saved">
        <div className="page__inner">
          <header className="page__header">
            <div>
              <p className="page__eyebrow">Vistas</p>
              <h1 className="page__title">Mis vistas guardadas</h1>
            </div>
          </header>
          <p className="page__empty">
            Debes iniciar sesión para ver y crear vistas guardadas.
          </p>
        </div>
      </div>
    );
  }

  // ------- Queries / Mutations -------

  const {
    data: savedViews,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["savedViews"],
    queryFn: () => fetchSavedViews(token),
    enabled: !!token, // muy importante para no disparar sin token
  });

  const totalViews = savedViews?.length || 0;

  const createMutation = useMutation({
    // OJO: ahora respetamos la firma: createSavedView(token, payload)
    mutationFn: (payload) => createSavedView(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedViews"] });
      setShowForm(false);
      setForm((prev) => ({
        ...prev,
        name: "",
        description: "",
      }));
    },
    onError: (err) => {
      console.error("Error al crear vista guardada:", err);
      alert(err?.message || "No se pudo guardar la vista");
    },
  });

  const deleteMutation = useMutation({
    // deleteSavedView(token, id)
    mutationFn: (id) => deleteSavedView(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedViews"] });
    },
    onError: (err) => {
      console.error("Error al eliminar vista:", err);
      alert(err?.message || "No se pudo eliminar la vista");
    },
  });

  // ------- Handlers -------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      filters: {
        categories: [form.category],
        countries: form.country ? [form.country] : [],
        dateRange: {
          type: form.dateType, // "lastDays"
          value: Number(form.dateValue) || 30,
        },
        severity: {
          min: form.severityMin ? Number(form.severityMin) : null,
          max: form.severityMax ? Number(form.severityMax) : null,
        },
      },
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar esta vista guardada?")) return;
    deleteMutation.mutate(id);
  };

  // Navegar a Stats aplicando la vista
  const handleApply = (view) => {
    const category = view.filters?.categories?.[0] || "wildfires";
    const country = view.filters?.countries?.[0] || "";

    const params = new URLSearchParams();
    if (country) params.set("country", country);

    const search = params.toString() ? `?${params.toString()}` : "";
    navigate(`/stats/${category}${search}`);
  };

  // ------- Render -------

  return (
    <div className="page page--saved">
      <div className="page__inner">
        <header className="page__header">
          <div>
            <p className="page__eyebrow">Vistas</p>
            <h1 className="page__title">Mis vistas guardadas</h1>
            <p className="page__subtitle">
              Guarda combinaciones de filtros que uses mucho para acceder rápido
              a ellas desde la app.
            </p>
          </div>

          <div className="page__header-actions">
            {!isLoading && !isError && (
              <span className="page__counter">
                <span className="page__counter-dot" />
                {totalViews} vistas
              </span>
            )}
            <button
              className="btn btn--primary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cerrar formulario" : "Nueva vista guardada"}
            </button>
          </div>
        </header>

        {/* Menú de área de usuario (Mi cuenta / Favoritos / Vistas guardadas / Backend) */}
        <UserAreaNav />

        {/* Panel de creación */}
        {showForm && (
          <section className="card card--form">
            <header className="card__header">
              <div>
                <h2 className="card__title">Crear nueva vista</h2>
                <p className="card__subtitle">
                  Define un nombre, filtros y guárdalo para reutilizarlo cuando
                  quieras.
                </p>
              </div>
            </header>

            <form className="saved-form" onSubmit={handleSubmit}>
              <div className="saved-form__row">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Wildfires últimos 30 días MX"
                  />
                </label>

                <label>
                  País
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Mexico"
                  />
                </label>
              </div>

              <label className="saved-form__full">
                Descripción
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Incendios en México últimos 30 días"
                />
              </label>

              <div className="saved-form__row">
                <label>
                  Categoría
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="wildfires">Wildfires</option>
                    <option value="earthquakes">Earthquakes</option>
                    <option value="storms">Storms</option>
                    <option value="dustHaze">Dust &amp; Haze</option>
                  </select>
                </label>

                <label>
                  Rango (días)
                  <div className="saved-form__inline">
                    <select
                      name="dateType"
                      value={form.dateType}
                      onChange={handleChange}
                    >
                      <option value="lastDays">Últimos N días</option>
                      {/* más opciones luego */}
                    </select>
                    <input
                      type="number"
                      name="dateValue"
                      min={1}
                      max={365}
                      value={form.dateValue}
                      onChange={handleChange}
                    />
                  </div>
                </label>
              </div>

              <div className="saved-form__row">
                <label>
                  Severidad mínima
                  <input
                    type="number"
                    name="severityMin"
                    value={form.severityMin}
                    onChange={handleChange}
                    placeholder="(opcional)"
                  />
                </label>
                <label>
                  Severidad máxima
                  <input
                    type="number"
                    name="severityMax"
                    value={form.severityMax}
                    onChange={handleChange}
                    placeholder="(opcional)"
                  />
                </label>
              </div>

              <div className="saved-form__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={createMutation.isLoading}
                >
                  {createMutation.isLoading ? "Guardando..." : "Guardar vista"}
                </button>
              </div>
            </form>
          </section>
        )}

        <main className="page__content">
          {isLoading && (
            <p className="page__state page__state--loading">
              Cargando vistas guardadas…
            </p>
          )}

          {isError && (
            <p className="page__state page__state--error">
              Hubo un problema al cargar tus vistas:{" "}
              <strong>{error?.message || "Error desconocido"}</strong>
            </p>
          )}

          {!isLoading && !isError && savedViews?.length === 0 && (
            <p className="page__state page__state--empty">
              No tienes vistas guardadas aún. Usa el botón de arriba para crear
              tu primera vista.
            </p>
          )}

          <div className="saved-grid">
            {savedViews?.map((view) => (
              <article key={view._id} className="card saved-card">
                <header className="saved-card__header">
                  <div>
                    <h2 className="saved-card__title">{view.name}</h2>
                    {view.description && (
                      <p className="saved-card__description">
                        {view.description}
                      </p>
                    )}
                  </div>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(view._id)}
                    title="Eliminar vista"
                    disabled={deleteMutation.isLoading}
                  >
                    ✕
                  </button>
                </header>

                <div className="saved-card__meta">
                  <span className="pill">
                    {view.filters?.categories?.[0] || "All categories"}
                  </span>
                  <span className="pill">
                    {view.filters?.countries?.join(", ") || "Global"}
                  </span>
                  {view.filters?.dateRange && (
                    <span className="pill">
                      {view.filters.dateRange.type} ·{" "}
                      {view.filters.dateRange.value}
                      d
                    </span>
                  )}
                </div>

                {view.filters?.severity && (
                  <div className="saved-card__severity">
                    <small>
                      Severidad: {view.filters.severity.min ?? "—"} -{" "}
                      {view.filters.severity.max ?? "—"}
                    </small>
                  </div>
                )}

                <div className="saved-card__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => handleApply(view)}
                  >
                    Ver en estadísticas
                  </button>
                </div>
              </article>
            ))}
          </div>

          {isFetching && !isLoading && (
            <p className="page__subtle">Actualizando lista…</p>
          )}
        </main>
      </div>
    </div>
  );
}
