import "../../styles/components/stats/_statsToggle.scss";

/**
 * StatsToggle — selector YEAR | COUNTRY
 */
export default function StatsToggle({ mode = "year", onChange }) {
  const Option = ({ value, children }) => (
    <button
      type="button"
      className={`segmented__btn ${mode === value ? "is-active" : ""}`}
      aria-pressed={mode === value}
      onClick={() => onChange?.(value)}
    >
      {children}
    </button>
  );

  return (
    <div className="stats-toggle" role="tablist" aria-label="Stats mode">
      <Option value="year">YEAR</Option>
      <Option value="country">COUNTRY</Option>
    </div>
  );
}
