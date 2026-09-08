const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const cloudinaryService = require("../utils/cloudinaryService");
const sendResponse = require("../utils/sendResponse");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please select an image to upload");
  }

  const image = await cloudinaryService.uploadImage(req.file.buffer);

  sendResponse(res, 201, image);
});

const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new ApiError(400, "publicId is required");
  }

  await cloudinaryService.deleteImage(publicId);

  sendResponse(res, 200, { message: "Image deleted" });
});

module.exports = { uploadImage, deleteImage };
