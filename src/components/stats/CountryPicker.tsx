import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import "../../styles/components/stats/_countryPicker.scss";

/**
 * CountryPicker — lista vertical de países con filtro por texto
 */
export default function CountryPicker({ countries = [], selected, onSelect, className = "" }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => String(c).toLowerCase().includes(s));
  }, [q, countries]);

  return (
    <aside className={`picker country-picker ${className}`}>
      <div className="search" role="search">
        <Search className="search-icon" aria-hidden />
        <input
          type="text"
          className="search-input"
          placeholder="country…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter by country"
        />
      </div>

      <ul className="list" role="listbox" aria-label="Countries">
        {filtered.map((c) => {
          const active = c === selected;
          return (
            <li key={c}>
              <button
                type="button"
                className={`item ${active ? "is-active" : ""}`}
                aria-selected={active}
                onClick={() => onSelect?.(c)}
                title={c}
              >
                {c}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
