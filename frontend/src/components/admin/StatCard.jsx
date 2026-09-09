import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function StatCard({ icon, label, value }) {
  return (
    <div className="card h-100 p-3 d-flex flex-row align-items-center gap-3">
      <div className="stat-card-icon">
        <FontAwesomeIcon icon={icon} />
      </div>

      <div>
        <div className="h4 mb-0">{value}</div>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );
}

export default StatCard;
