import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import useDocumentTitle from "../hooks/useDocumentTitle";

function NotFound() {
  useDocumentTitle("Page Not Found");

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FontAwesomeIcon icon={faCompass} />
      </div>

      <h1 className="h4">Page not found</h1>
      <p className="mb-3">The page you are looking for does not exist.</p>

      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
