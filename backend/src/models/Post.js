const mongoose = require("mongoose");
const generateSlug = require("../utils/generateSlug");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot be more than 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot be more than 300 characters"],
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", async function () {
  if (this.isModified("title")) {
    const baseSlug = generateSlug(this.title);
    const slugTaken = await this.constructor.exists({ slug: baseSlug, _id: { $ne: this._id } });

    this.slug = slugTaken ? `${baseSlug}-${Math.random().toString(36).slice(2, 7)}` : baseSlug;
  }
});

postSchema.index({ title: "text", excerpt: "text" });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model("Post", postSchema);
