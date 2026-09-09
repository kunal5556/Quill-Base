import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import { useAddCommentMutation, useGetPostCommentsQuery } from "../../features/comments/commentsApi";
import getErrorMessage from "../../utils/getErrorMessage";

function CommentList({ postId }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useGetPostCommentsQuery({ postId, page });
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

  const handleAdd = async (content) => {
    const result = await addComment({ postId, content });

    return Boolean(result.data);
  };

  return (
    <section className="mt-5">
      <h2 className="h4 mb-3">Comments {data ? `(${data.meta.total})` : ""}</h2>

      <div className="mb-4">
        <CommentForm isSubmitting={isAdding} onSubmit={handleAdd} />
      </div>

      {isLoading && <Loader />}

      {error && <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />}

      {data && data.comments.length === 0 && (
        <p className="text-muted">No comments yet. Be the first to share your thoughts.</p>
      )}

      {data &&
        data.comments.map((comment) => <CommentItem key={comment._id} comment={comment} postId={postId} />)}

      <Pagination page={page} totalPages={data?.meta.totalPages || 0} onChange={setPage} />
    </section>
  );
}

export default CommentList;
