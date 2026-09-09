import { useState } from "react";
import { Link } from "react-router-dom";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useNotify from "../../hooks/useNotify";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useGetAllCommentsQuery } from "../../features/admin/adminApi";
import { useDeleteCommentMutation } from "../../features/comments/commentsApi";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";

function ManageComments() {
  useDocumentTitle("Manage Comments");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);

  const { notify, toastProps } = useNotify();
  const { data, isFetching, error, refetch } = useGetAllCommentsQuery({
    page,
    search: search || undefined,
  });
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleDelete = async () => {
    const result = await deleteComment({
      commentId: commentToDelete._id,
      postId: commentToDelete.post._id,
    });

    setCommentToDelete(null);

    if (result.error) {
      notify(getErrorMessage(result.error), "error");
    } else {
      notify("Comment deleted");
    }
  };

  return (
    <section>
      <h1 className="page-title">Manage Comments</h1>

      <div className="mb-3">
        <label className="form-label" htmlFor="commentSearch">
          Search comments
        </label>
        <input
          id="commentSearch"
          type="search"
          className="form-control"
          placeholder="Search comment text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {isFetching && <Loader />}

      {error && <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />}

      {data && data.comments.length === 0 && (
        <EmptyState
          icon={faComments}
          title="No comments found"
          message={search ? `No comments match "${search}".` : "Readers have not commented on any post yet."}
        />
      )}

      {data && data.comments.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Comment</th>
                <th>Author</th>
                <th>Post</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.comments.map((comment) => (
                <tr key={comment._id}>
                  <td>{comment.content}</td>
                  <td>{comment.user.name}</td>
                  <td>
                    <Link to={`/posts/${comment.post.slug}`}>{comment.post.title}</Link>
                  </td>
                  <td>{formatDate(comment.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setCommentToDelete(comment)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={data?.meta.totalPages || 0} onChange={setPage} />

      <ConfirmDialog
        open={Boolean(commentToDelete)}
        title="Delete comment"
        message={`Remove the comment by ${commentToDelete?.user.name}? This cannot be undone.`}
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setCommentToDelete(null)}
      />

      <Toast {...toastProps} />
    </section>
  );
}

export default ManageComments;
