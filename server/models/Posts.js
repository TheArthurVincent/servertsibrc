const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: false },
    img: { type: String, required: false },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog_Model = mongoose.model("BlogPosts", blogSchema);

module.exports = {
  Blog_Model,
};
