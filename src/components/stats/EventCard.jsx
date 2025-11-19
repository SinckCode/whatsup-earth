import "../../styles/components/stats/_eventCard.scss";

export default function EventCard({ label, value, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`event-card ${active ? "is-active" : ""}`}
      onClick={onClick}
      title={label}
    >
      <span className="label">{label}</span>
      <span className="value">{formatVal(value)}</span>
    </button>
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
