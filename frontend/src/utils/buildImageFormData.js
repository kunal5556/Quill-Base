const buildImageFormData = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return formData;
};

export default buildImageFormData;
