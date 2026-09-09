import { useSearchParams } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import PostGrid from "../components/posts/PostGrid";
import { useGetPostsQuery } from "../features/posts/postsApi";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isFetching, error, refetch } = useGetPostsQuery({ page, search });

  const handlePageChange = (nextPage) => {
    searchParams.set("page", nextPage);
    setSearchParams(searchParams);
  };

  return (
    <section>
      <h1 className="page-title mb-1">Search Results</h1>
      <p className="page-subtitle">
        {data ? `${data.meta.total} result${data.meta.total === 1 ? "" : "s"} for "${search}"` : `Searching for "${search}"`}
      </p>

      <PostGrid
        posts={data?.posts || []}
        isLoading={isFetching}
        error={error}
        onRetry={refetch}
        emptyTitle="No matching posts"
        emptyMessage={`We could not find any post for "${search}".`}
      />

      <Pagination page={page} totalPages={data?.meta.totalPages || 0} onChange={handlePageChange} />
    </section>
  );
}

export default Search;
