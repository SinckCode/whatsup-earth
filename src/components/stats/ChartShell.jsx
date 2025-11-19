import "../../styles/components/stats/_chartShell.scss";

/**
 * ChartShell
 * Marco con efecto glass. Define una altura por defecto
 * y permite sobreescribirla con el prop `height`.
 *
 * Uso:
 *   <ChartShell>...</ChartShell>
 *   <ChartShell height="420px">...</ChartShell>
 *   <ChartShell height="clamp(260px, 36vw, 420px)">...</ChartShell>
 */
export default function ChartShell({
  children,
  className = "",
  height = "clamp(260px, 36vw, 420px)", // <- altura segura por defecto
}) {
  return (
    <section className={`chart-shell ${className}`}>
      <div className="chart-box" style={{ "--chart-h": height }}>
        {children ?? <span className="chart-placeholder">Chart goes here</span>}
      </div>
    </section>
  );
}
