import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FontAwesomeIcon icon={icon} />
      </div>

      <h2 className="h5">{title}</h2>
      {message && <p className="mb-3">{message}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
