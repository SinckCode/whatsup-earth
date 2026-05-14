import React, { useEffect, useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { apiClient } from '../api/client';
import { alerts, categories } from '../api/endpoints';
import { createAlertSchema } from '../schemas/alertSchemas';
import '../styles/pages/AlertsPage.scss';

export default function Alerts() {
  const { user, isAuthenticated } = useAuth();
  const [alertsList, setAlertsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categorySlug: '',
    regions: [],
    countries: [],
    severityMin: 0,
    notifyByEmail: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch alerts and categories
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    loadData();
  }, [isAuthenticated, user?.id]);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);

      const [alertsData, categoriesData] = await Promise.all([
        alerts.list(),
        categories.list(),
      ]);

      setAlertsList(alertsData || []);
      setCategoriesList(categoriesData || []);
    } catch (err) {
      setError(err.message || 'Error cargando alertas');
      console.error('Error loading alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  }

  async function handleCreateAlert(e) {
    e.preventDefault();
    setFormErrors({});

    try {
      // Validate with Zod
      const validatedData = createAlertSchema.parse(formData);

      // Create alert
      await alerts.create(validatedData);

      // Reload alerts
      await loadData();

      // Reset form
      setFormData({
        categorySlug: '',
        regions: [],
        countries: [],
        severityMin: 0,
        notifyByEmail: true,
      });
      setShowForm(false);
    } catch (err) {
      if (err.issues) {
        // Zod validation error
        const errors = {};
        err.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFormErrors(errors);
      } else {
        setError(err.message || 'Error creando alerta');
      }
    }
  }

  async function handleDeleteAlert(alertId) {
    if (!window.confirm('¿Eliminar esta alerta?')) return;

    try {
      await alerts.delete(alertId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando alerta');
    }
  }

  async function handleToggleAlert(alert) {
    try {
      await alerts.update(alert.id, { isActive: !alert.isActive });
      await loadData();
    } catch (err) {
      setError(err.message || 'Error actualizando alerta');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="alerts-page alerts-page--empty">
        <p>Debes iniciar sesión para ver tus alertas.</p>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <div className="alerts-page__header">
        <h1>Mis Alertas</h1>
        <button
          className="alerts-page__btn-create"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Alerta'}
        </button>
      </div>

      {error && (
        <div className="alerts-page__error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <form className="alerts-page__form" onSubmit={handleCreateAlert}>
          <h2>Crear Nueva Alerta</h2>

          <div className="alerts-form__field">
            <label htmlFor="category">Categoría*</label>
            <select
              id="category"
              value={formData.categorySlug}
              onChange={(e) => handleFormChange('categorySlug', e.target.value)}
              className={formErrors.categorySlug ? 'error' : ''}
            >
              <option value="">Selecciona una categoría</option>
              {categoriesList.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {formErrors.categorySlug && (
              <span className="alerts-form__error">{formErrors.categorySlug}</span>
            )}
          </div>

          <div className="alerts-form__field">
            <label htmlFor="severityMin">Severidad Mínima</label>
            <input
              id="severityMin"
              type="number"
              min="0"
              max="100"
              value={formData.severityMin}
              onChange={(e) => handleFormChange('severityMin', parseInt(e.target.value))}
            />
            {formErrors.severityMin && (
              <span className="alerts-form__error">{formErrors.severityMin}</span>
            )}
          </div>

          <div className="alerts-form__field">
            <label>
              <input
                type="checkbox"
                checked={formData.notifyByEmail}
                onChange={(e) => handleFormChange('notifyByEmail', e.target.checked)}
              />
              Notificaciones por email
            </label>
          </div>

          <button type="submit" className="alerts-form__btn-submit">
            Crear Alerta
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="alerts-page__loading">Cargando alertas...</div>
      ) : alertsList.length === 0 ? (
        <div className="alerts-page__empty">
          <p>No tienes alertas aún.</p>
          <button onClick={() => setShowForm(true)}>Crear tu primera alerta</button>
        </div>
      ) : (
        <div className="alerts-page__list">
          {alertsList.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-card__header">
                <h3>{alert.categorySlug}</h3>
                <span className={`alert-card__status ${alert.isActive ? 'active' : 'inactive'}`}>
                  {alert.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="alert-card__content">
                <p>
                  <strong>Severidad mínima:</strong> {alert.severityMin}
                </p>
                {alert.regions.length > 0 && (
                  <p>
                    <strong>Regiones:</strong> {alert.regions.join(', ')}
                  </p>
                )}
                {alert.countries.length > 0 && (
                  <p>
                    <strong>Países:</strong> {alert.countries.join(', ')}
                  </p>
                )}
                <p>
                  <strong>Notificaciones:</strong> {alert.notifyByEmail ? 'Email' : 'No'}
                </p>
              </div>
              <div className="alert-card__actions">
                <button
                  className={`btn btn--toggle ${alert.isActive ? 'active' : ''}`}
                  onClick={() => handleToggleAlert(alert)}
                >
                  {alert.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  className="btn btn--danger"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
