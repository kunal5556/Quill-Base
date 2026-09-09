import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import ImageUploader from "../../components/admin/ImageUploader";
import RichTextEditor from "../../components/admin/RichTextEditor";
import {
  useCreatePostMutation,
  useGetAdminPostByIdQuery,
  useUpdatePostMutation,
} from "../../features/admin/adminApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import getErrorMessage from "../../utils/getErrorMessage";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  coverImage: { url: "", publicId: "" },
};

const hasEditorContent = (html) => {
  const container = document.createElement("div");
  container.innerHTML = html;

  return container.textContent.trim().length > 0 || Boolean(container.querySelector("img"));
};

const mapFieldErrors = (error) => {
  const fieldErrors = {};

  error?.data?.errors?.forEach((item) => {
    fieldErrors[item.field] = item.message;
  });

  return fieldErrors;
};

function PostForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  useDocumentTitle(isEditMode ? "Edit Post" : "New Post");

  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [loadedPostId, setLoadedPostId] = useState(null);

  const { data: categories = [] } = useGetCategoriesQuery();
  const {
    data: existingPost,
    isLoading: isLoadingPost,
    error: loadError,
    refetch,
  } = useGetAdminPostByIdQuery(id, { skip: !isEditMode });

  const [createPost, { isLoading: isCreating, error: createError }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating, error: updateError }] = useUpdatePostMutation();

  const isSaving = isCreating || isUpdating;
  const saveError = createError || updateError;

  if (existingPost && existingPost._id !== loadedPostId) {
    setLoadedPostId(existingPost._id);
    setForm({
      title: existingPost.title,
      excerpt: existingPost.excerpt,
      content: existingPost.content,
      category: existingPost.category._id,
      coverImage: {
        url: existingPost.coverImage?.url || "",
        publicId: existingPost.coverImage?.publicId || "",
      },
    });
  }

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const warnBeforeLeaving = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);

    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [isDirty]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setIsDirty(true);
  };

  const validateForm = () => {
    const errors = {};

    if (form.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (form.excerpt.length > 300) {
      errors.excerpt = "Excerpt cannot be more than 300 characters";
    }

    if (!form.category) {
      errors.category = "Please choose a category";
    }

    if (!hasEditorContent(form.content)) {
      errors.content = "Content is required";
    }

    return errors;
  };

  const handleSave = async (status) => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      status,
      coverImage: form.coverImage,
    };

    const result = isEditMode ? await updatePost({ id, ...payload }) : await createPost(payload);

    if (result.error) {
      setFormErrors(mapFieldErrors(result.error));
      return;
    }

    setIsDirty(false);
    navigate("/admin/posts", { state: { message: isEditMode ? "Post updated" : "Post created" } });
  };

  const handleCancel = () => {
    if (isDirty) {
      setIsLeaveConfirmOpen(true);
      return;
    }

    navigate("/admin/posts");
  };

  if (isEditMode && isLoadingPost) {
    return <Loader />;
  }

  if (loadError) {
    return <ErrorMessage message={getErrorMessage(loadError)} onRetry={refetch} />;
  }

  return (
    <section>
      <h1 className="page-title">{isEditMode ? "Edit Post" : "New Post"}</h1>

      {saveError && !saveError.data?.errors && (
        <div className="alert alert-danger">{getErrorMessage(saveError)}</div>
      )}

      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
          {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="excerpt">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows="2"
            className={`form-control ${formErrors.excerpt ? "is-invalid" : ""}`}
            value={form.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
          />
          <small className="text-muted">Leave this empty and a short excerpt will be generated from the content.</small>
          {formErrors.excerpt && <div className="invalid-feedback">{formErrors.excerpt}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={`form-select ${formErrors.category ? "is-invalid" : ""}`}
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {formErrors.category && <div className="invalid-feedback">{formErrors.category}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="coverImage">
            Cover image
          </label>
          <ImageUploader value={form.coverImage} onChange={(image) => updateField("coverImage", image)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <RichTextEditor value={form.content} onChange={(html) => updateField("content", html)} />
          {formErrors.content && <div className="text-danger small mt-1">{formErrors.content}</div>}
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            Save Draft
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleSave("published")} disabled={isSaving}>
            {isSaving ? "Saving..." : "Publish"}
          </button>
          <button type="button" className="btn btn-link" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={isLeaveConfirmOpen}
        title="Discard changes"
        message="You have unsaved changes. Leave this page and lose them?"
        confirmLabel="Discard"
        onConfirm={() => navigate("/admin/posts")}
        onCancel={() => setIsLeaveConfirmOpen(false)}
      />
    </section>
  );
}

export default PostForm;
