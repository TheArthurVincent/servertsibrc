const mongoose = require("mongoose");

const { Schema } = mongoose;

const eventsSchema = new Schema(
  {
    studentID: { type: String, required: false, unique: false },
    student: { type: String, required: false, unique: false },
    status: { type: String, required: true, unique: false, default: "marcado" },
    link: { type: String, required: true, unique: false },
    description: { type: String, required: false, unique: false },
    category: { type: String, required: true, unique: false },
    date: { type: String, required: true, unique: false },
    time: { type: String, required: true, unique: false },
  },
  { timestamps: true }
);

const Events_Model = mongoose.model("Events", eventsSchema);

module.exports = {
  Events_Model,
};
