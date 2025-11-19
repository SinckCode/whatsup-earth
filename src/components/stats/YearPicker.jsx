import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import "../../styles/components/stats/_yearPicker.scss";

/**
 * YearPicker — lista vertical de años con filtro
 *
 * Props:
 *  - years: number[]
 *  - selectedYear: number
 *  - onSelect(year: number): void
 */
export default function YearPicker({
  years = [],
  selectedYear,
  onSelect,
  className = "",
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return years;
    return years.filter((y) => String(y).includes(q));
  }, [q, years]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQ(value);
  };

  return (
    <aside className={`picker year-picker ${className}`}>
      <div className="search" role="search">
        <Search className="search-icon" aria-hidden />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="search-input"
          placeholder="year…"
          value={q}
          onChange={handleChange}
          aria-label="Filter by year"
        />
      </div>

      <ul className="list" role="listbox" aria-label="Years">
        {filtered.length === 0 && (
          <li className="empty" aria-live="polite">
            <span>No years found</span>
          </li>
        )}

        {filtered.map((y) => {
          const active = y === selectedYear;
          return (
            <li key={y} role="none">
              <button
                type="button"
                role="option"
                className={`item ${active ? "is-active" : ""}`}
                aria-selected={active}
                onClick={() => onSelect?.(y)}
              >
                {y}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
