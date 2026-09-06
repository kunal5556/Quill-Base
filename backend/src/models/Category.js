const mongoose = require("mongoose");
const generateSlug = require("../utils/generateSlug");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot be more than 200 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
});

module.exports = mongoose.model("Category", categorySchema);
