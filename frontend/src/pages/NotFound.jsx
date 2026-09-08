import { Link } from "react-router-dom";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/common/EmptyState";

function NotFound() {
  return (
    <EmptyState
      icon={faCompass}
      title="Page not found"
      message="The page you are looking for does not exist."
      action={
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      }
    />
  );
}

export default NotFound;
