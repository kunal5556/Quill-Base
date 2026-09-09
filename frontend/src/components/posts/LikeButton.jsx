import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { useLikePostMutation, useUnlikePostMutation } from "../../features/likes/likesApi";
import { selectCurrentUser } from "../../features/auth/authSlice";

function LikeButton({ post }) {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();

  const handleClick = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const toggleLike = post.isLiked ? unlikePost : likePost;
    toggleLike({ postId: post._id, slug: post.slug });
  };

  return (
    <button
      type="button"
      className={`btn ${post.isLiked ? "btn-danger" : "btn-outline-danger"}`}
      onClick={handleClick}
      disabled={isLiking || isUnliking}
      aria-label={post.isLiked ? "Unlike this post" : "Like this post"}
    >
      <FontAwesomeIcon icon={post.isLiked ? faHeartFilled : faHeartOutline} className="me-2" />
      {post.likeCount}
    </button>
  );
}

export default LikeButton;
