const mongoose = require("mongoose");

const { Schema } = mongoose;

const universalCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    modules: { type: [moduleCourseSchema], required: true },
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
const classCourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    attachments: { type: [attachmentCourseSchema], required: true },
  },
  { timestamps: true }
);

const attachmentCourseSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: false },
});

const Course_Schema = mongoose.model("Course", universalCourseSchema);
const Module_Schema = mongoose.model("Module", moduleCourseSchema);
const Class_Schema = mongoose.model("Class", classCourseSchema);
const Attachment_Schema = mongoose.model("Attachment", attachmentCourseSchema);
