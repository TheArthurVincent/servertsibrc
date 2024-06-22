const mongoose = require("mongoose");
const { Schema } = mongoose;

const nextTutoring = new Schema(
  {
    studentID: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    meetingUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const nextLiveClass = new Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    meetingUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const NextTutoring_Model = mongoose.model("nextTutoring", nextTutoring);
const NextLiveGroupClass_Model = mongoose.model("nextLiveClass", nextLiveClass);

module.exports = {
  NextTutoring_Model,
  NextLiveGroupClass_Model,
};
