import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../../features/categories/categoriesApi";
import getErrorMessage from "../../utils/getErrorMessage";

function CategoryFormDialog({ open, category, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [openedFor, setOpenedFor] = useState(null);

  const [createCategory, { isLoading: isCreating, error: createError }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating, error: updateError }] = useUpdateCategoryMutation();

  const dialogKey = open ? category?._id || "new" : null;

  if (dialogKey !== openedFor) {
    setOpenedFor(dialogKey);
    setForm({ name: category?.name || "", description: category?.description || "" });
    setFormErrors({});
  }

  const isSaving = isCreating || isUpdating;
  const saveError = createError || updateError;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async () => {
    const errors = {};

    if (form.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    }

    if (form.description.length > 200) {
      errors.description = "Description cannot be more than 200 characters";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = { name: form.name.trim(), description: form.description.trim() };
    const result = category
      ? await updateCategory({ id: category._id, ...payload })
      : await createCategory(payload);

    if (result.data) {
      onSaved(category ? "Category updated" : "Category created");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>

      <DialogContent>
        {saveError && <div className="alert alert-danger">{getErrorMessage(saveError)}</div>}

        <div className="mb-3">
          <label className="form-label" htmlFor="categoryName">
            Name
          </label>
          <input
            id="categoryName"
            name="name"
            type="text"
            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
            value={form.name}
            onChange={handleChange}
          />
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>

        <div>
          <label className="form-label" htmlFor="categoryDescription">
            Description
          </label>
          <textarea
            id="categoryDescription"
            name="description"
            rows="3"
            className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
            value={form.description}
            onChange={handleChange}
          />
          {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
        </div>
      </DialogContent>

      <DialogActions>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFormDialog;
