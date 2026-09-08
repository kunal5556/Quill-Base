const multer = require("multer");
const ApiError = require("../utils/ApiError");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new ApiError(400, "Only JPG, PNG and WEBP images are allowed"));
    }

    callback(null, true);
  },
});

module.exports = upload.single("image");
