import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import getErrorMessage from "../utils/getErrorMessage";

function Categories() {
  useDocumentTitle("Categories");

  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return (
    <section>
      <h1 className="page-title">Categories</h1>
      <p className="page-subtitle">Browse posts by the topic you are interested in.</p>

      {categories.length === 0 ? (
        <EmptyState icon={faFolderOpen} title="No categories yet" message="Categories will appear here once they are added." />
      ) : (
        <div className="row g-4">
          {categories.map((category) => (
            <div className="col-12 col-md-6 col-lg-4" key={category._id}>
              <Link className="text-reset" to={`/categories/${category.slug}`}>
                <div className="card h-100 p-3">
                  <h2 className="h5">{category.name}</h2>
                  {category.description && <p className="text-muted small mb-2">{category.description}</p>}
                  <span className="badge text-bg-secondary align-self-start">
                    {category.postCount} post{category.postCount === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Categories;
