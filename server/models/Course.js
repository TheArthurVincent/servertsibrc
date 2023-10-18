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
  classes: [  
    { type: Schema.Types.ObjectId, ref: "Class", required: false, default: [] },
  ],
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
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
        required: false,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Course_Model = mongoose.model("Course", courseSchema);
const Module_Model = mongoose.model("Module", moduleSchema);
const Class_Model = mongoose.model("Class", classSchema);

module.exports = {
  Course_Model,
  Module_Model,
  Class_Model,
};
