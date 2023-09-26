const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validade: [validator.isEmail, "Escolha um e-mail válido"],
    },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    doc: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    permissions: { type: String, required: false, default: "student" },
  },
  { timestamps: true }
);

const personalClassesSchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: false },
    attachments: { type: Array, required: false },
  },
  { timestamps: true }
);

const Student_Model = mongoose.model("Student", studentSchema);
const PersonalClass_Model = mongoose.model(
  "PersonalClasses",
  personalClassesSchema
);

module.exports = {
  Student_Model,
  PersonalClass_Model,
};
