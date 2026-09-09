import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const maxLength = 1000;

function CommentForm({ initialValue = "", submitLabel = "Post Comment", isSubmitting, onSubmit, onCancel }) {
  const [content, setContent] = useState(initialValue);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) {
    return (
      <div className="alert alert-secondary">
        <Link to="/login" state={{ from: location.pathname }}>
          Log in
        </Link>{" "}
        to join the discussion.
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const succeeded = await onSubmit(trimmedContent);

    if (succeeded) {
      setContent(initialValue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="form-control"
        rows="3"
        maxLength={maxLength}
        placeholder="Share your thoughts"
        aria-label="Comment"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">
          {content.length}/{maxLength}
        </small>

        <div className="d-flex gap-2">
          {onCancel && (
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-sm btn-primary" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
