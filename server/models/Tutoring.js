const mongoose = require("mongoose");

const { Schema } = mongoose;

const tutoringSchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: false },
    attachments: { type: Array, required: false },
  },
  { timestamps: true }
);

const Tutoring_Model = mongoose.model("TutoringSchema", tutoringSchema);

module.exports = {
  Tutoring_Model,
};
