const mongoose = require("mongoose");
const { Schema } = mongoose;

const nextTutoring = new Schema(
  {
    studentID: { type: String, required: true, unique: true },
    date: { type: String, required: true, unique: true },
    meetingUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const nextLiveClass = new Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: false },
    meetingUrl: { type: String, required: true },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

const NextTutoring_Model = mongoose.model("nextTutoring", nextTutoring);
const NextLiveClass_Model = mongoose.model("nextLiveClass", nextLiveClass);

module.exports = {
  NextTutoring_Model,
  NextLiveClass_Model,
};
