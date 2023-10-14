const mongoose = require("mongoose");
const { Schema } = mongoose;

const classSchema = new Schema({
  classTitle: { type: String, required: true },
  description: { type: String, required: true },
  srcVideos: [
    {
      title: { type: String, required: false },
      url: { type: String, required: false },
      description: { type: String, required: false },
    },
  ],
  srcAttachments: [
    {
      title: { type: String, required: false },
      src: { type: String, required: false },
      description: { type: String, required: false },
    },
  ],
});

const moduleSchema = new Schema({
  moduleTitle: { type: String, required: true },
  classes: [classSchema],
});

const courseSchema = new Schema(
  {
    courseTitle: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, required: false },
    courseColor: { type: String, required: false, default: "#1e1e1e" },
    img: {
      type: String,
      required: false,
      default:
        "https://img.myloview.com.br/posters/digital-study-icon-outline-digital-study-vector-icon-color-flat-isolated-700-275116571.jpg",
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const Course_Model = mongoose.model("Course", courseSchema);

module.exports = {
  Course_Model,
};
