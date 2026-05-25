import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../../styles/components/stats/_statsBarChart.scss";

/**
 * StatsBarChart
 * Reutilizable para YEAR/COUNTRY.
 *
 * Props:
 *  - data: Array<{ [xKey]: string|number, [yKey]: number }>
 *  - xKey: string (clave del eje X)
 *  - yKey: string (clave del valor)
 *  - unit?: string (ej. "events")
 *  - loading?: boolean
 *  - error?: boolean | Error
 *  - empty?: boolean
 *  - onBarClick?: (row) => void
 *  - className?: string
 */
export default function StatsBarChart({
  data = [],
  xKey = "name",
  yKey = "value",
  unit = "",
  loading = false,
  error = false,
  empty = false,
  onBarClick,
  className = "",
}) {
  // 1) Estado de carga
  if (loading) {
    return (
      <div
        className="stats-barchart__skeleton"
        aria-busy="true"
        aria-label="Loading chart..."
      />
    );
  }

  // 2) Estado de error
  if (error) {
    return (
      <div className="stats-barchart__message">
        <p>We couldn&apos;t load NASA data right now.</p>
        <p className="hint">Try again in a moment.</p>
      </div>
    );
  }

  // 3) Sin datos
  const noData = empty || !data || data.length === 0;
  if (noData) {
    return (
      <div className="stats-barchart__message">
        <p>No events for this selection.</p>
        <p className="hint">Try another year, region or disaster type.</p>
      </div>
    );
  }

  // 4) Gráfica normal
  return (
    <div className={`stats-barchart ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.25)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.25)" }}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.25)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.25)" }}
            width={56}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.08)" }}
            contentStyle={{
              background: "rgba(20,20,20,0.9)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              color: "white",
            }}
            formatter={(v) => [Number(v).toLocaleString(), unit]}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
          />
          <Bar
            dataKey={yKey}
            fill="url(#barFill)"
            radius={[8, 8, 0, 0]}
            onClick={(_, idx) => onBarClick?.(data[idx])}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
