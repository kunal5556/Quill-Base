import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import placeholderCover from "../../assets/placeholder-cover.svg";
import formatDate from "../../utils/formatDate";

function PostCard({ post }) {
  return (
    <article className="card h-100">
      <Link to={`/posts/${post.slug}`}>
        <img
          src={post.coverImage?.url || placeholderCover}
          className="card-img-top post-card-image"
          alt={post.title}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <Link className="badge text-bg-secondary text-decoration-none" to={`/categories/${post.category.slug}`}>
            {post.category.name}
          </Link>
        </div>

        <h2 className="h5 card-title">
          <Link className="post-card-title" to={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <p className="card-text text-muted small flex-grow-1">{post.excerpt}</p>

        <div className="d-flex justify-content-between align-items-center text-muted small border-top pt-2">
          <span>
            {post.author.name} &middot; {formatDate(post.publishedAt)}
          </span>

          <span className="d-flex gap-3">
            <span>
              <FontAwesomeIcon icon={faHeart} className="me-1" />
              {post.likeCount}
            </span>
            <span>
              <FontAwesomeIcon icon={faComment} className="me-1" />
              {post.commentCount}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
