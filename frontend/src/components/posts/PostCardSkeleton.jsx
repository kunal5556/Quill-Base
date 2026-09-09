import Skeleton from "@mui/material/Skeleton";

function PostCardSkeleton() {
  return (
    <div className="card h-100">
      <Skeleton variant="rectangular" className="post-card-image" />

      <div className="card-body">
        <Skeleton variant="rounded" width={90} height={20} />
        <Skeleton variant="text" height={32} className="mt-2" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
}

export default PostCardSkeleton;
