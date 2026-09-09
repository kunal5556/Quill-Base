import { useState } from "react";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import CategoryFormDialog from "../../components/admin/CategoryFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import Toast from "../../components/common/Toast";
import useNotify from "../../hooks/useNotify";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../features/categories/categoriesApi";
import getErrorMessage from "../../utils/getErrorMessage";

function ManageCategories() {
  useDocumentTitle("Manage Categories");

  const [dialogCategory, setDialogCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { notify, toastProps } = useNotify();
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const openDialog = (category) => {
    setDialogCategory(category);
    setIsDialogOpen(true);
  };

  const handleSaved = (message) => {
    setIsDialogOpen(false);
    notify(message);
  };

  const handleDelete = async () => {
    const result = await deleteCategory(categoryToDelete._id);

    setCategoryToDelete(null);

    if (result.error) {
      notify(getErrorMessage(result.error), "error");
    } else {
      notify("Category deleted");
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="page-title mb-0">Manage Categories</h1>
        <button type="button" className="btn btn-primary" onClick={() => openDialog(null)}>
          Add Category
        </button>
      </div>

      {isLoading && <Loader />}

      {error && <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />}

      {categories && categories.length === 0 && (
        <EmptyState
          icon={faFolderOpen}
          title="No categories yet"
          message="Add your first category so posts can be organised."
        />
      )}

      {categories && categories.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Posts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td className="text-muted">{category.slug}</td>
                  <td className="text-muted">{category.description || "-"}</td>
                  <td>{category.postCount}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openDialog(category)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormDialog
        open={isDialogOpen}
        category={dialogCategory}
        onClose={() => setIsDialogOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Delete category"
        message={`Delete the category "${categoryToDelete?.name}"? Categories that still have posts cannot be deleted.`}
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      <Toast {...toastProps} />
    </section>
  );
}

export default ManageCategories;
