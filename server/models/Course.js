const mongoose = require("mongoose");
const { Schema } = mongoose;

const course = new Schema(
  {
    courseTitle: { type: String, required: true },
    description: { type: String, required: false },
    courseImgLink: {
      type: String,
      required: false,
      default:
        "https://img.myloview.com.br/posters/digital-study-icon-outline-digital-study-vector-icon-color-flat-isolated-700-275116571.jpg",
    },
    modules: [
      {
        moduleTitle: { type: String, required: true },
        description: { type: String, required: false },
        moduleImgLink: {
          type: String,
          required: false,
          default:
            "https://img.myloview.com.br/posters/digital-study-icon-outline-digital-study-vector-icon-color-flat-isolated-700-275116571.jpg",
        },
        classes: [
          {
            classTitle: { type: String, required: true },
            description: { type: String, required: true },
            classImgLink: {
              type: String,
              required: false,
              default:
                "https://img.myloview.com.br/posters/digital-study-icon-outline-digital-study-vector-icon-color-flat-isolated-700-275116571.jpg",
            },
            videoUrl: { type: String, required: false },
            attachments: { type: String, required: false },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
const Course_Model = mongoose.model("newCourse", course);

module.exports = {
  Course_Model,
};
