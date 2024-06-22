const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseClass = new Schema({
  title: { type: String, required: true },
  module: { type: String, required: true },
  order: { type: Number, required: true },
  image: { type: String, required: false },
  description: { type: String, required: false },
  video: { type: String, required: false },
  elements: { type: Array, required: false },
});
const courseInfo = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: false },
  studentsWhoHaveAccessToIt: { type: Array, required: false },
});

const CourseClass_Model = mongoose.model("CourseClass", courseClass);
const CourseInfo_Model = mongoose.model("CoursesInfo", courseInfo);

module.exports = { CourseClass_Model, CourseInfo_Model };