import MuiPagination from "@mui/material/Pagination";

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center my-4">
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(event, value) => onChange(value)}
        color="primary"
        shape="rounded"
      />
    </div>
  );
}

export default Pagination;
