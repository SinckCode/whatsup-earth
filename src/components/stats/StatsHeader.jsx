import { Globe2, Plus, Info, BarChart3 } from "lucide-react";
import "../../styles/components/stats/_statsHeader.scss";

export default function StatsHeader({
  title = "WILDFIRES",
  subtitle = "",
  onInfo,
  onAdd,
  onChart,
}) {
  return (
    <header className="stats-header">
      <div className="title-wrap">
        <Globe2 className="brand-icon" />
        <h2 className="title">{String(title).toUpperCase()}</h2>
        {subtitle ? <span className="subtitle">{subtitle}</span> : null}
      </div>


      
    </header>
  );
}
