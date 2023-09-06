const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    CPF: { type: String, required: true },
    dateofbirth: { type: Date, required: true },
    permissions: { type: String, required: true },
    classes: { type: [personalClassesSchema], required: false },
    picture: { type: String, required: false },
  },
  { timestamps: true }
);

const personalClassesSchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: Date, required: true },
    comments: { type: String, required: false },
    attachments: [String],
  },
  { timestamps: true }
);

const Student_Schema = mongoose.model("Student", studentSchema);
const PersonalClasses_Schema = mongoose.model(
  "PersonalClasses",
  personalClassesSchema
);

module.exports = {
  Student_Schema,
  PersonalClasses_Schema,
};
