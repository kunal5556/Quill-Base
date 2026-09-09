import { Link } from "react-router-dom";
import { useGetPostsQuery } from "../../features/posts/postsApi";
import formatDate from "../../utils/formatDate";

function RelatedPosts({ categorySlug, currentPostId }) {
  const { data } = useGetPostsQuery({ category: categorySlug, limit: 4 });

  const relatedPosts = (data?.posts || []).filter((post) => post._id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-5">
      <h2 className="h5 mb-3">More from this category</h2>

      <ul className="list-unstyled mb-0">
        {relatedPosts.map((post) => (
          <li className="border-bottom py-2" key={post._id}>
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            <div className="text-muted small">{formatDate(post.publishedAt)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RelatedPosts;
