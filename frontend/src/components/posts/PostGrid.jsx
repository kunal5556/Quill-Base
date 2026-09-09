import { faNewspaper } from "@fortawesome/free-regular-svg-icons";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import getErrorMessage from "../../utils/getErrorMessage";

function PostGrid({ posts, isLoading, error, onRetry, emptyTitle, emptyMessage }) {
  if (isLoading) {
    return (
      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="col-12 col-md-6 col-lg-4" key={item}>
            <PostCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={getErrorMessage(error)} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return <EmptyState icon={faNewspaper} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="row g-4">
      {posts.map((post) => (
        <div className="col-12 col-md-6 col-lg-4" key={post._id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}

export default PostGrid;
