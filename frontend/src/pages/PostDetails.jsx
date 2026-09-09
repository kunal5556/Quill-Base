import { Link, useParams } from "react-router-dom";
import CommentList from "../components/comments/CommentList";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import LikeButton from "../components/posts/LikeButton";
import RelatedPosts from "../components/posts/RelatedPosts";
import RichTextContent from "../components/posts/RichTextContent";
import NotFound from "./NotFound";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetPostBySlugQuery } from "../features/posts/postsApi";
import formatDate from "../utils/formatDate";
import getErrorMessage from "../utils/getErrorMessage";

function PostDetails() {
  const { slug } = useParams();
  const { data: post, isLoading, error, refetch } = useGetPostBySlugQuery(slug);

  useDocumentTitle(post?.title);

  if (isLoading) {
    return <Loader />;
  }

  if (error?.status === 404) {
    return <NotFound />;
  }

  if (error) {
    return <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return (
    <div className="row justify-content-center">
      <article className="col-12 col-lg-9">
        <div className="mb-2">
          <Link className="badge text-bg-secondary text-decoration-none" to={`/categories/${post.category.slug}`}>
            {post.category.name}
          </Link>
        </div>

        <h1 className="mb-2">{post.title}</h1>

        <p className="text-muted">
          By {post.author.name} &middot; {formatDate(post.publishedAt)}
        </p>

        {post.coverImage?.url && (
          <img src={post.coverImage.url} className="img-fluid rounded mb-4" alt={post.title} />
        )}

        <RichTextContent html={post.content} />

        <div className="d-flex align-items-center gap-3 border-top pt-3 mt-4">
          <LikeButton post={post} />
          <span className="text-muted">
            {post.commentCount} comment{post.commentCount === 1 ? "" : "s"}
          </span>
        </div>

        <RelatedPosts categorySlug={post.category.slug} currentPostId={post._id} />

        <CommentList postId={post._id} />
      </article>
    </div>
  );
}

export default PostDetails;
