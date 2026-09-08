const express = require("express");
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/image", protect, adminOnly, upload, uploadImage);
router.delete("/image", protect, adminOnly, deleteImage);

module.exports = router;
