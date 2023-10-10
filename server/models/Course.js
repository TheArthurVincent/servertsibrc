const mongoose = require("mongoose");
const { Schema } = mongoose;

const Course = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    modules: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        classes: [
          {
            title: { type: String, required: true },
            description: { type: String, required: true },
            videoUrl: { type: String, required: false },
            attachments: { type: String, required: false },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
const Course_Model = mongoose.model("nextTutoring", Course);

module.exports = {
  Course_Model,
};
