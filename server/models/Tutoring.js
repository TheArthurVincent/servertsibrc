const mongoose = require("mongoose");

const { Schema } = mongoose;

const tutoringSchema = new Schema(
  {
    title: { type: String, required: true },
    studentID: { type: String, required: true },
    date: { type: String, required: true },
    monthYear: { type: String, required: true },
    videoUrl: { type: String, required: false },
    comments: { type: String, required: false }, 
    attachments: { type: String, required: false },
  },
  { timestamps: true }
);

const Tutoring_Model = mongoose.model("TutoringSchema", tutoringSchema);

module.exports = {
  Tutoring_Model,
};
