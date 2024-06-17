const mongoose = require("mongoose");
const { Schema } = mongoose;

const homeworkSchema = new Schema({
  studentID: { type: String, required: false },
  category: { type: String, required: true },
  assignmentDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String, required: false },
  videoUrl: { type: String, required: false },
  googleDriveLink: { type: String, required: false },
  status: { type: String, default: "pending", required: true },
  studentsWhoDidIt: { type: Array, required: false }
});

const Homework_Model = mongoose.model("Homework", homeworkSchema);

module.exports = {
  Homework_Model,
};
