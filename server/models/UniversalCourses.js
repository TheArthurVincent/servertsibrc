const mongoose = require("mongoose");

const { Schema } = mongoose;

const classCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    videoUrl: { type: String, required: false },
    attachments: { type: Array, required: false },
  },
  { timestamps: true }
);

const moduleCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    classes: { type: [classCourseSchema], required: false },
  },
  { timestamps: true }
);
const universalCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: false },
    description: { type: String, required: false },
    modules: { type: [moduleCourseSchema], required: false },
  },
  { timestamps: true }
);

const Course_Model = mongoose.model("Course", universalCourseSchema);
const Module_Model = mongoose.model("Module", moduleCourseSchema);
const GroupClass_Model = mongoose.model("Class", classCourseSchema);
