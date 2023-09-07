const mongoose = require("mongoose");

const { Schema } = mongoose;

const attachmentCourseSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: false },
});
const classCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    attachments: { type: [attachmentCourseSchema], required: true },
  },
  { timestamps: true }
);

const moduleCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    classes: { type: [classCourseSchema], required: true },
  },
  { timestamps: true }
);
const universalCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    modules: { type: [moduleCourseSchema], required: true },
  },
  { timestamps: true }
);

const Course_Model = mongoose.model("Course", universalCourseSchema);
const Module_Model = mongoose.model("Module", moduleCourseSchema);
const Class_Model = mongoose.model("Class", classCourseSchema);
const Attachment_Model = mongoose.model("Attachment", attachmentCourseSchema);
