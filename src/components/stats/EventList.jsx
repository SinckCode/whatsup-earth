import "../../styles/components/stats/_eventList.scss";
import EventCard from "./EventCard";

export default function EventList({
  title = "WORLD",
  total = 0,
  items = [],
  activeKey,
  onSelect,
}) {
  return (
    <aside className="event-list" aria-label="Ranking by country">
      <div className="world-hd">
        <div className="caption">{title}</div>
        <div className="total">{formatVal(total)}</div>
      </div>

      <div className="rows">
        {items.map((it) => (
          <EventCard
            key={it.key ?? it.label}
            label={it.label}
            value={it.value}
            active={activeKey === (it.key ?? it.label)}
            onClick={() => onSelect?.(it)}
          />
        ))}
      </div>
    </aside>
  );
}

function formatVal(v) {
  if (v == null) return "—";
  try {
    return typeof v === "number" ? v.toLocaleString() : v;
  } catch {
    return String(v);
  }
}
