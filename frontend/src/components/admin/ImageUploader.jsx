import { useState } from "react";
import { useDeleteImageMutation, useUploadImageMutation } from "../../features/admin/adminApi";
import buildImageFormData from "../../utils/buildImageFormData";
import getErrorMessage from "../../utils/getErrorMessage";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 2 * 1024 * 1024;

function ImageUploader({ value, onChange }) {
  const [uploadError, setUploadError] = useState("");
  const [uploadedPublicId, setUploadedPublicId] = useState("");

  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError("");

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    if (file.size > maxFileSize) {
      setUploadError("Image must be 2MB or smaller");
      return;
    }

    const result = await uploadImage(buildImageFormData(file));

    if (result.error) {
      setUploadError(getErrorMessage(result.error));
      return;
    }

    setUploadedPublicId(result.data.publicId);
    onChange(result.data);
  };

  const handleRemove = async () => {
    if (uploadedPublicId && uploadedPublicId === value.publicId) {
      await deleteImage(uploadedPublicId);
      setUploadedPublicId("");
    }

    onChange({ url: "", publicId: "" });
  };

  return (
    <div>
      {value.url && (
        <div className="mb-2">
          <img src={value.url} alt="Cover preview" className="img-fluid rounded cover-preview" />
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center gap-2">
        <input
          id="coverImage"
          type="file"
          className="form-control"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {value.url && (
          <button type="button" className="btn btn-outline-danger" onClick={handleRemove}>
            Remove
          </button>
        )}
      </div>

      {isLoading && <small className="text-muted">Uploading image...</small>}
      {uploadError && <div className="text-danger small mt-1">{uploadError}</div>}
    </div>
  );
}

export default ImageUploader;
