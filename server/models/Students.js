const mongoose = require("mongoose");

const { Schema } = mongoose;

const personalClassesSchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: false },
    attachments: [String],
  },
  { timestamps: true }
);
const studentSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    doc: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    permissions: { type: String, required: false, default: "student" },
    classes: { type: [personalClassesSchema], required: false },
  },
  { timestamps: true }
);

const Student_Model = mongoose.model("Student", studentSchema);
const PersonalClasses_Model = mongoose.model(
  "PersonalClasses",
  personalClassesSchema
);

module.exports = {
  Student_Model,
  PersonalClasses_Model,
};
