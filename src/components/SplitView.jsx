import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export default function SplitView({ items = [] }) {
  const mapRef = useRef(null);
  const mapObj = useRef(null);

  // Pequeño helper para formatear fechas de EONET
  const formatDate = (iso) => {
    if (!iso) return 'Fecha desconocida';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    mapObj.current = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-98.35, 19.43], // aprox. centro MX
      zoom: 2,
    });

    return () => {
      if (mapObj.current) {
        mapObj.current.remove();
      }
    };
  }, []);

  // Marcar eventos en el mapa
  useEffect(() => {
    if (!mapObj.current) return;

    // limpiar marcadores anteriores
    document.querySelectorAll('.ml-marker').forEach((el) => el.remove());

    // colocar nuevos marcadores
    items.forEach((ev) => {
      (ev.geometry || []).forEach((g) => {
        const [lon, lat] = g.coordinates || [];
        if (typeof lon !== 'number' || typeof lat !== 'number') return;

        const el = document.createElement('div');
        el.className = 'ml-marker';
        el.style.cssText =
          'width:10px;height:10px;border-radius:9999px;background:#ff5722;box-shadow:0 0 0 3px rgba(255,87,34,.35);';

        new maplibregl.Marker(el).setLngLat([lon, lat]).addTo(mapObj.current);
      });
    });
  }, [items]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 2fr)',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      {/* Panel de eventos */}
      <div
        style={{
          overflowY: 'auto',
          padding: 16,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.65)',
          color: 'white',
          maxHeight: 480,
          backdropFilter: 'blur(12px)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>
          Eventos activos ({items.length})
        </h3>
        <p
          style={{
            marginTop: 0,
            marginBottom: 16,
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Datos en tiempo casi real de EONET / NASA. Haz scroll para explorar
          los desastres recientes en la Tierra.
        </p>

        {items.map((ev) => {
          const geometries = ev.geometry || [];
          const firstGeom = geometries[0] || null;
          const lastGeom =
            geometries.length > 1
              ? geometries[geometries.length - 1]
              : firstGeom;

          const startedAt = firstGeom?.date;
          const updatedAt = lastGeom?.date || ev.closed;
          const isClosed = Boolean(ev.closed);

          const mainCategory = ev.categories?.[0];
          const categoryLabel = mainCategory
            ? mainCategory.title || mainCategory.id
            : 'Sin categoría';

          const magValue =
            typeof ev.magnitudeValue === 'number'
              ? ev.magnitudeValue.toFixed(2)
              : null;
          const magUnit = ev.magnitudeUnit || '';
          const magDesc = ev.magnitudeDescription || '';

          const sources = ev.sources || [];

          return (
            <article
              key={ev.id}
              style={{
                marginBottom: 12,
                padding: 10,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(15,15,24,0.7)',
              }}
            >
              {/* Título + estado */}
              <header
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.35,
                  }}
                >
                  {ev.title}
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    backgroundColor: isClosed
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(76,175,80,0.2)',
                    color: isClosed ? '#ffb74d' : '#8bc34a',
                  }}
                >
                  {isClosed ? 'Cerrado' : 'Activo'}
                </span>
              </header>

              {/* Fila de categoría y fechas */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  fontSize: 11,
                  marginBottom: 4,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(25,118,210,0.25)',
                    fontWeight: 500,
                  }}
                >
                  {categoryLabel}
                </span>

                {startedAt && (
                  <span style={{ opacity: 0.8 }}>
                    Inicio: {formatDate(startedAt)}
                  </span>
                )}
                {updatedAt && (
                  <span style={{ opacity: 0.8 }}>
                    Última actividad: {formatDate(updatedAt)}
                  </span>
                )}
              </div>

              {/* Magnitud (si existe) */}
              {magValue && (
                <div
                  style={{
                    fontSize: 11,
                    marginBottom: 4,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <strong>Magnitud:</strong>{' '}
                  {magValue} {magUnit}{' '}
                  {magDesc && (
                    <span style={{ opacity: 0.75 }}>({magDesc})</span>
                  )}
                </div>
              )}

              {/* Fuentes */}
              {sources.length > 0 && (
                <div style={{ fontSize: 10, marginBottom: 4 }}>
                  <span style={{ opacity: 0.7 }}>Fuentes:</span>{' '}
                  {sources
                    .slice(0, 3)
                    .map((s) => s.id || s.title)
                    .join(', ')}
                  {sources.length > 3 && '…'}
                </div>
              )}

              {/* Link a NASA */}
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    fontSize: 11,
                    color: '#90caf9',
                    textDecoration: 'none',
                  }}
                >
                  Ver más detalles en NASA ↗
                </a>
              )}
            </article>
          );
        })}

        {items.length === 0 && (
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 16,
            }}
          >
            No se encontraron eventos con los filtros actuales.
          </div>
        )}
      </div>

      {/* Mapa */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          minHeight: 360,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
        }}
      />
    </div>
  );
}
