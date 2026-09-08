import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between flex-wrap gap-2" role="alert">
      <span>
        <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
        {message}
      </span>

      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
