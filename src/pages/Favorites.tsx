// src/pages/FavoritesPage.jsx
import React, { useState } from "react";
import { useAuth } from "../app/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  addFavorite,
  deleteFavorite,
} from "../api/favoritesApi";
import UserAreaNav from "../components/account/UserAreaNav";
import "../styles/pages/FavoritesPage.scss";

export default function FavoritesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    eventId: "",
    title: "",
    category: "wildfires",
    link: "",
    lon: "",
    lat: "",
    firstDate: "",
    lastDate: "",
    note: "",
  });

  if (!token) {
    return (
      <div className="page page--favorites">
        <div className="page__inner">
          <header className="page__header">
            <div>
              <p className="page__eyebrow">Favoritos</p>
              <h1 className="page__title">Mis favoritos</h1>
            </div>
          </header>
          <p className="page__empty">
            Debes iniciar sesión para ver y administrar tus favoritos.
          </p>
        </div>
      </div>
    );
  }

  // --------- Query ---------
  const {
    data: favorites,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(token),
    enabled: !!token,
  });

  const totalFavorites = favorites?.length || 0;

  // --------- Mutations ---------
  const createMutation = useMutation({
    mutationFn: (payload: any) => addFavorite(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      setShowForm(false);
      setForm({
        eventId: "",
        title: "",
        category: "wildfires",
        link: "",
        lon: "",
        lat: "",
        firstDate: "",
        lastDate: "",
        note: "",
      });
    },
    onError: (err) => {
      console.error("Error al crear favorito:", err);
      alert(err?.message || "No se pudo crear el favorito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deleteFavorite(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (err) => {
      console.error("Error al eliminar favorito:", err);
      alert(err?.message || "No se pudo eliminar el favorito");
    },
  });

  // --------- Handlers ---------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      eventId: form.eventId,
      title: form.title,
      category: form.category,
      link: form.link,
      coordinates:
        form.lon && form.lat
          ? [Number(form.lon), Number(form.lat)]
          : undefined,
      firstDate: form.firstDate || undefined,
      lastDate: form.lastDate || undefined,
      note: form.note || undefined,
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este favorito?")) return;
    deleteMutation.mutate(id);
  };

  // --------- Render ---------
  return (
    <div className="page page--favorites">
      <div className="page__inner">
        <header className="page__header">
          <div>
            <p className="page__eyebrow">Favoritos</p>
            <h1 className="page__title">Mis favoritos</h1>
            <p className="page__subtitle">
              Marca eventos importantes para regresar a ellos rápidamente.
            </p>
          </div>

          <div className="page__header-actions">
            {!isLoading && !isError && (
              <span className="page__counter">
                <span className="page__counter-dot" />
                {totalFavorites} favoritos
              </span>
            )}
            <button
              className="btn btn--primary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cerrar formulario" : "Nuevo favorito (manual)"}
            </button>
          </div>
        </header>

        {/* Menú de área de usuario (Mi cuenta / Favoritos / Vistas guardadas / Backend) */}
        <UserAreaNav />

        {showForm && (
          <section className="card card--form">
            <header className="card__header">
              <div>
                <h2 className="card__title">Crear nuevo favorito</h2>
                <p className="card__subtitle">
                  Guarda eventos clave de EONET para consultarlos después.
                </p>
              </div>
            </header>

            <form className="fav-form" onSubmit={handleSubmit}>
              <div className="fav-form__row">
                <label>
                  Event ID
                  <input
                    type="text"
                    name="eventId"
                    value={form.eventId}
                    onChange={handleChange}
                    required
                    placeholder="EONET_1234"
                  />
                </label>

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
              </div>

              <label className="fav-form__full">
                Título
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Wildfire - California"
                />
              </label>

              <label className="fav-form__full">
                Link
                <input
                  type="url"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://eonet.gsfc.nasa.gov/..."
                />
              </label>

              <div className="fav-form__row">
                <label>
                  Lon
                  <input
                    type="number"
                    name="lon"
                    value={form.lon}
                    onChange={handleChange}
                    placeholder="-120.5"
                  />
                </label>
                <label>
                  Lat
                  <input
                    type="number"
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    placeholder="37.2"
                  />
                </label>
              </div>

              <div className="fav-form__row">
                <label>
                  Primera fecha
                  <input
                    type="date"
                    name="firstDate"
                    value={form.firstDate}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Última fecha
                  <input
                    type="date"
                    name="lastDate"
                    value={form.lastDate}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="fav-form__full">
                Nota
                <input
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Por qué marcaste este evento"
                />
              </label>

              <div className="fav-form__actions">
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
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? "Guardando..."
                    : "Guardar favorito"}
                </button>
              </div>
            </form>
          </section>
        )}

        <main className="page__content">
          {isLoading && (
            <p className="page__state page__state--loading">
              Cargando favoritos…
            </p>
          )}

          {isError && (
            <p className="page__state page__state--error">
              Hubo un problema al cargar tus favoritos:{" "}
              <strong>{error?.message || "Error desconocido"}</strong>
            </p>
          )}

          {!isLoading && !isError && favorites?.length === 0 && (
            <p className="page__state page__state--empty">
              No tienes favoritos aún. Usa el botón de arriba para crear uno.
            </p>
          )}

          <div className="favorites-grid">
            {favorites?.map((fav) => (
              <article key={fav._id} className="card fav-card">
                <header className="fav-card__header">
                  <div>
                    <h2 className="fav-card__title">{fav.title}</h2>
                    <p className="fav-card__meta">
                      <span className="pill">{fav.category}</span>
                      {fav.eventId && (
                        <span className="pill">ID: {fav.eventId}</span>
                      )}
                    </p>
                  </div>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(fav._id)}
                    title="Eliminar favorito"
                    disabled={deleteMutation.isPending}
                  >
                    ✕
                  </button>
                </header>

                {fav.note && <p className="fav-card__note">{fav.note}</p>}

                {fav.link && (
                  <a
                    href={fav.link}
                    className="fav-card__link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver en NASA EONET ↗
                  </a>
                )}

                {fav.coordinates && fav.coordinates.length === 2 && (
                  <p className="fav-card__coords">
                    Lon: {fav.coordinates[0]} · Lat: {fav.coordinates[1]}
                  </p>
                )}

                {(fav.firstDate || fav.lastDate) && (
                  <p className="fav-card__dates">
                    {fav.firstDate && (
                      <span>
                        Desde:{" "}
                        {new Date(fav.firstDate).toLocaleDateString()}
                      </span>
                    )}
                    {fav.lastDate && (
                      <span>
                        {" "}
                        · Hasta:{" "}
                        {new Date(fav.lastDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                )}
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
