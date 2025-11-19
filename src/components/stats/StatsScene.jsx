// StatsScene.jsx
// Capa de layout/escena para las vistas de Stats.
// Solo organiza posicionamiento y aplica temas con CSS vars.

import "../../styles/components/stats/_scene.scss";

export default function StatsScene({
  theme = "wildfires",        // "wildfires" | "earthquakes" | "dust"
  mode = "year",              // "year" | "country"
  header,                     // <StatsHeader .../>
  chart,                      // <ChartShell>...</ChartShell>
  toggleBar,                  // YEAR/COUNTRY toggle + Filters
  worldPanel,                 // <EventList .../>
  centerPicker,               // <YearPicker /> o <CountryPicker />
}) {
  return (
    <div className={`stats-scene stats-scene--${theme}`}>
      {/* Header arriba (titulo + acciones) */}
      <div className="scene-header">{header}</div>

      {/* Card de gráfica flotando */}
      <div className="scene-chart">{chart}</div>

      {/* Toggle YEAR/COUNTRY grande */}
      <div className="scene-toggle">{toggleBar}</div>

      {/* Cuando el usuario elige YEAR o COUNTRY,
          mostramos el layout con paneles y lista */}
      <div className={`scene-panels scene-panels--${mode}`}>
        <div className="panel-search">{/* arriba, caja de búsqueda integrada en picker */}
          {/* el YearPicker/CountryPicker ya incluye su search visual */}
        </div>
        <div className="panel-center">
          {centerPicker}
        </div>
        <div className="panel-right">
          {worldPanel}
        </div>
      </div>
    </div>
  );
}
