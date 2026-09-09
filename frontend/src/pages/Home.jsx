import { useSearchParams } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import CategoryList from "../components/categories/CategoryList";
import Pagination from "../components/common/Pagination";
import PostGrid from "../components/posts/PostGrid";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import { useGetPostsQuery } from "../features/posts/postsApi";

function Home() {
  useDocumentTitle("Latest Posts");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data, isFetching, error, refetch } = useGetPostsQuery({
    page,
    sort,
    category: category || undefined,
  });

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    setSearchParams(nextParams);
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h1 className="page-title mb-0">Latest Posts</h1>

        <div>
          <label className="form-label me-2 mb-0" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="form-select d-inline-block w-auto"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value, page: "" })}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most liked</option>
          </select>
        </div>
      </div>

      <p className="page-subtitle">Read the latest articles from the Quill Base team.</p>

      {categories.length > 0 && (
        <CategoryList
          categories={categories}
          activeSlug={category}
          onSelect={(slug) => updateParams({ category: slug, page: "" })}
        />
      )}

      <PostGrid
        posts={data?.posts || []}
        isLoading={isFetching}
        error={error}
        onRetry={refetch}
        emptyTitle="No posts yet"
        emptyMessage="There are no published posts to show right now."
      />

      <Pagination
        page={page}
        totalPages={data?.meta.totalPages || 0}
        onChange={(nextPage) => updateParams({ page: nextPage })}
      />
    </section>
  );
}

export default Home;
