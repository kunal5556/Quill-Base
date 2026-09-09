import { useEffect, useState } from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { Link, useLocation } from "react-router-dom";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useNotify from "../../hooks/useNotify";
import {
  useDeletePostMutation,
  useGetAdminPostsQuery,
  useUpdatePostStatusMutation,
} from "../../features/admin/adminApi";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";

function PostActions({ post, onToggleStatus, onDelete, isBusy }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      <Link className="btn btn-sm btn-outline-secondary" to={`/admin/posts/${post._id}/edit`}>
        Edit
      </Link>
      <button type="button" className="btn btn-sm btn-outline-primary" onClick={onToggleStatus} disabled={isBusy}>
        {post.status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

function ManagePosts() {
  useDocumentTitle("Manage Posts");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);

  const location = useLocation();
  const { notify, toastProps } = useNotify();

  const { data, isFetching, error, refetch } = useGetAdminPostsQuery({
    page,
    status: status || undefined,
    search: search || undefined,
  });

  const [updatePostStatus, { isLoading: isUpdatingStatus }] = useUpdatePostStatusMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  useEffect(() => {
    if (location.state?.message) {
      notify(location.state.message);
      window.history.replaceState({}, "");
    }
  }, [location.state, notify]);

  const handleToggleStatus = (post) => {
    updatePostStatus({ id: post._id, status: post.status === "published" ? "draft" : "published" });
  };

  const handleDelete = async () => {
    const result = await deletePost(postToDelete._id);

    setPostToDelete(null);

    if (result.error) {
      notify(getErrorMessage(result.error), "error");
    } else {
      notify("Post deleted");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="page-title mb-0">Manage Posts</h1>
        <Link className="btn btn-primary" to="/admin/posts/new">
          New Post
        </Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="col-12 col-md-8">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control"
              placeholder="Search posts by title"
              aria-label="Search posts by title"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>
      </div>

      {isFetching && <Loader />}

      {error && <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />}

      {data && data.posts.length === 0 && <p className="text-muted">No posts match your filters.</p>}

      {data && data.posts.length > 0 && (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.category.name}</td>
                    <td>
                      <span className={`badge ${post.status === "published" ? "text-bg-success" : "text-bg-warning"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{post.likeCount}</td>
                    <td>{post.commentCount}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <PostActions
                        post={post}
                        isBusy={isUpdatingStatus}
                        onToggleStatus={() => handleToggleStatus(post)}
                        onDelete={() => setPostToDelete(post)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-md-none">
            {data.posts.map((post) => (
              <div className="card p-3 mb-3" key={post._id}>
                <h2 className="h6">{post.title}</h2>
                <p className="text-muted small mb-2">
                  {post.category.name} &middot; {formatDate(post.createdAt)} &middot; {post.likeCount} likes &middot;{" "}
                  {post.commentCount} comments
                </p>
                <span
                  className={`badge align-self-start mb-2 ${
                    post.status === "published" ? "text-bg-success" : "text-bg-warning"
                  }`}
                >
                  {post.status}
                </span>
                <PostActions
                  post={post}
                  isBusy={isUpdatingStatus}
                  onToggleStatus={() => handleToggleStatus(post)}
                  onDelete={() => setPostToDelete(post)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination page={page} totalPages={data?.meta.totalPages || 0} onChange={setPage} />

      <ConfirmDialog
        open={Boolean(postToDelete)}
        title="Delete post"
        message={`"${postToDelete?.title}" and all of its comments and likes will be removed permanently.`}
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPostToDelete(null)}
      />

      <Toast {...toastProps} />
    </section>
  );
}

export default ManagePosts;
