import { useParams, useSearchParams } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import PostGrid from "../components/posts/PostGrid";
import { useGetCategoryBySlugQuery } from "../features/categories/categoriesApi";
import { useGetPostsQuery } from "../features/posts/postsApi";
import getErrorMessage from "../utils/getErrorMessage";

function CategoryPosts() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useGetCategoryBySlugQuery(slug);

  const { data, isFetching, error, refetch } = useGetPostsQuery({ page, category: slug });

  const handlePageChange = (nextPage) => {
    searchParams.set("page", nextPage);
    setSearchParams(searchParams);
  };

  if (isCategoryLoading) {
    return <Loader />;
  }

  if (categoryError) {
    return <ErrorMessage message={getErrorMessage(categoryError)} onRetry={refetchCategory} />;
  }

  return (
    <section>
      <h1 className="page-title mb-1">{category.name}</h1>
      {category.description && <p className="text-muted mb-1">{category.description}</p>}
      <p className="page-subtitle">
        {category.postCount} published post{category.postCount === 1 ? "" : "s"}
      </p>

      <PostGrid
        posts={data?.posts || []}
        isLoading={isFetching}
        error={error}
        onRetry={refetch}
        emptyTitle="No posts in this category yet"
        emptyMessage="Check back later or browse another category."
      />

      <Pagination page={page} totalPages={data?.meta.totalPages || 0} onChange={handlePageChange} />
    </section>
  );
}

export default CategoryPosts;
