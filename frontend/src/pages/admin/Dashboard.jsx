import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { faComments, faFileLines, faFolder, faNewspaper, faPenToSquare, faUsers } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/admin/StatCard";
import { useGetAdminStatsQuery } from "../../features/admin/adminApi";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/getErrorMessage";

function Dashboard() {
  useDocumentTitle("Admin Dashboard");

  const { data: stats, isLoading, error, refetch } = useGetAdminStatsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />;
  }

  const cards = [
    { label: "Total posts", value: stats.totalPosts, icon: faNewspaper },
    { label: "Published", value: stats.publishedPosts, icon: faFileLines },
    { label: "Drafts", value: stats.draftPosts, icon: faPenToSquare },
    { label: "Categories", value: stats.totalCategories, icon: faFolder },
    { label: "Comments", value: stats.totalComments, icon: faComments },
    { label: "Users", value: stats.totalUsers, icon: faUsers },
  ];

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="page-title mb-0">Admin Dashboard</h1>
        <Link className="btn btn-primary" to="/admin/posts/new">
          New Post
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-4" key={card.label}>
            <StatCard icon={card.icon} label={card.label} value={card.value} />
          </div>
        ))}
      </div>

      <h2 className="h5 mb-3">Recent posts</h2>

      {stats.recentPosts.length === 0 ? (
        <p className="text-muted">No posts have been created yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPosts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <Link to={`/admin/posts/${post._id}/edit`}>{post.title}</Link>
                  </td>
                  <td>{post.category.name}</td>
                  <td>
                    <span className={`badge ${post.status === "published" ? "text-bg-success" : "text-bg-warning"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
