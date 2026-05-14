import React, { useEffect, useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { regions } from '../api/endpoints';
import { createRegionSchema, updateRegionSchema } from '../schemas/regionSchemas';
import '../styles/pages/RegionsPage.scss';

export default function Regions() {
  const { user, isAuthenticated } = useAuth();
  const [regionsList, setRegionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    minLat: -90,
    maxLat: 90,
    minLon: -180,
    maxLon: 180,
    isDefault: false,
    color: '#3B82F6',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch regions
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    loadRegions();
  }, [isAuthenticated, user?.id]);

  async function loadRegions() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await regions.list();
      setRegionsList(data || []);
    } catch (err) {
      setError(err.message || 'Error cargando regiones');
      console.error('Error loading regions:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180,
      isDefault: false,
      color: '#3B82F6',
    });
    setFormErrors({});
    setEditingId(null);
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: field.includes('Lat') || field.includes('Lon')
        ? parseFloat(value) || 0
        : value,
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

  async function handleSaveRegion(e) {
    e.preventDefault();
    setFormErrors({});

    try {
      const schema = editingId ? updateRegionSchema : createRegionSchema;
      const validatedData = schema.parse(formData);

      if (editingId) {
        await regions.update(editingId, validatedData);
      } else {
        await regions.create(validatedData);
      }

      await loadRegions();
      resetForm();
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
        setError(err.message || 'Error guardando región');
      }
    }
  }

  function handleEditRegion(region) {
    setEditingId(region.id);
    setFormData({
      name: region.name,
      minLat: region.minLat,
      maxLat: region.maxLat,
      minLon: region.minLon,
      maxLon: region.maxLon,
      isDefault: region.isDefault,
      color: region.color,
    });
    setShowForm(true);
    setFormErrors({});
  }

  async function handleDeleteRegion(regionId) {
    if (!window.confirm('¿Eliminar esta región?')) return;

    try {
      await regions.delete(regionId);
      await loadRegions();
    } catch (err) {
      setError(err.message || 'Error eliminando región');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="regions-page regions-page--empty">
        <p>Debes iniciar sesión para ver tus regiones personalizadas.</p>
      </div>
    );
  }

  return (
    <div className="regions-page">
      <div className="regions-page__header">
        <h1>Mis Regiones</h1>
        <button
          className="regions-page__btn-create"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Región'}
        </button>
      </div>

      {error && (
        <div className="regions-page__error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <form className="regions-page__form" onSubmit={handleSaveRegion}>
          <h2>{editingId ? 'Editar Región' : 'Crear Nueva Región'}</h2>

          <div className="regions-form__field">
            <label htmlFor="name">Nombre*</label>
            <input
              id="name"
              type="text"
              placeholder="Mi región personalizada"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && (
              <span className="regions-form__error">{formErrors.name}</span>
            )}
          </div>

          <div className="regions-form__coordinates">
            <div className="regions-form__field">
              <label htmlFor="minLat">Latitud Mínima*</label>
              <input
                id="minLat"
                type="number"
                min="-90"
                max="90"
                step="0.01"
                value={formData.minLat}
                onChange={(e) => handleFormChange('minLat', e.target.value)}
                className={formErrors.minLat ? 'error' : ''}
              />
              {formErrors.minLat && (
                <span className="regions-form__error">{formErrors.minLat}</span>
              )}
            </div>

            <div className="regions-form__field">
              <label htmlFor="maxLat">Latitud Máxima*</label>
              <input
                id="maxLat"
                type="number"
                min="-90"
                max="90"
                step="0.01"
                value={formData.maxLat}
                onChange={(e) => handleFormChange('maxLat', e.target.value)}
                className={formErrors.maxLat ? 'error' : ''}
              />
              {formErrors.maxLat && (
                <span className="regions-form__error">{formErrors.maxLat}</span>
              )}
            </div>

            <div className="regions-form__field">
              <label htmlFor="minLon">Longitud Mínima*</label>
              <input
                id="minLon"
                type="number"
                min="-180"
                max="180"
                step="0.01"
                value={formData.minLon}
                onChange={(e) => handleFormChange('minLon', e.target.value)}
                className={formErrors.minLon ? 'error' : ''}
              />
              {formErrors.minLon && (
                <span className="regions-form__error">{formErrors.minLon}</span>
              )}
            </div>

            <div className="regions-form__field">
              <label htmlFor="maxLon">Longitud Máxima*</label>
              <input
                id="maxLon"
                type="number"
                min="-180"
                max="180"
                step="0.01"
                value={formData.maxLon}
                onChange={(e) => handleFormChange('maxLon', e.target.value)}
                className={formErrors.maxLon ? 'error' : ''}
              />
              {formErrors.maxLon && (
                <span className="regions-form__error">{formErrors.maxLon}</span>
              )}
            </div>
          </div>

          <div className="regions-form__field">
            <label htmlFor="color">Color</label>
            <input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => handleFormChange('color', e.target.value)}
              className={formErrors.color ? 'error' : ''}
            />
            {formErrors.color && (
              <span className="regions-form__error">{formErrors.color}</span>
            )}
          </div>

          <div className="regions-form__field">
            <label>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => handleFormChange('isDefault', e.target.checked)}
              />
              Usar como región por defecto
            </label>
          </div>

          <button type="submit" className="regions-form__btn-submit">
            {editingId ? 'Actualizar Región' : 'Crear Región'}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="regions-page__loading">Cargando regiones...</div>
      ) : regionsList.length === 0 ? (
        <div className="regions-page__empty">
          <p>No tienes regiones personalizadas aún.</p>
          <button onClick={() => setShowForm(true)}>Crear tu primera región</button>
        </div>
      ) : (
        <div className="regions-page__list">
          {regionsList.map((region) => (
            <div
              key={region.id}
              className="region-card"
              style={{ borderLeftColor: region.color }}
            >
              <div className="region-card__header">
                <h3>{region.name}</h3>
                {region.isDefault && <span className="region-card__badge">Por defecto</span>}
              </div>
              <div className="region-card__content">
                <p>
                  <strong>Latitud:</strong> {region.minLat}° a {region.maxLat}°
                </p>
                <p>
                  <strong>Longitud:</strong> {region.minLon}° a {region.maxLon}°
                </p>
                <p>
                  <strong>Color:</strong>{' '}
                  <span
                    className="region-card__color-sample"
                    style={{ backgroundColor: region.color }}
                  />
                  {region.color}
                </p>
              </div>
              <div className="region-card__actions">
                <button
                  className="btn btn--secondary"
                  onClick={() => handleEditRegion(region)}
                >
                  Editar
                </button>
                <button
                  className="btn btn--danger"
                  onClick={() => handleDeleteRegion(region.id)}
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
