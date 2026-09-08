const cloudinary = require("../config/cloudinary");

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "quill-base" }, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    uploadStream.end(buffer);
  });

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
