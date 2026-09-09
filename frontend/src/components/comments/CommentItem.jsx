import { useState } from "react";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import ConfirmDialog from "../common/ConfirmDialog";
import { useDeleteCommentMutation, useUpdateCommentMutation } from "../../features/comments/commentsApi";
import { selectCurrentUser } from "../../features/auth/authSlice";
import formatDate from "../../utils/formatDate";

function CommentItem({ comment, postId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const user = useSelector(selectCurrentUser);
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const isOwner = user?.id === comment.user._id;
  const canDelete = isOwner || user?.role === "admin";

  const handleUpdate = async (content) => {
    const result = await updateComment({ commentId: comment._id, postId, content });

    if (result.data) {
      setIsEditing(false);
      return true;
    }

    return false;
  };

  const handleDelete = async () => {
    await deleteComment({ commentId: comment._id, postId });
    setIsConfirmOpen(false);
  };

  return (
    <div className="border-bottom py-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <strong>{comment.user.name}</strong>
        <small className="text-muted">{formatDate(comment.createdAt)}</small>
      </div>

      {isEditing ? (
        <CommentForm
          initialValue={comment.content}
          submitLabel="Save Changes"
          isSubmitting={isUpdating}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p className="mb-2">{comment.content}</p>

          {canDelete && (
            <div className="d-flex gap-2">
              {isOwner && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete comment"
        message="This comment will be removed permanently. Continue?"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default CommentItem;
