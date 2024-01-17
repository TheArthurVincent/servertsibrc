const mongoose = require("mongoose");
const { Schema } = mongoose;

const pictureSchema = new Schema({
  name: { type: String, required: true },
  src: { type: String, required: true },
  studentID: { type: String, required: true },
});

const Picture_Model = mongoose.model("Picture", pictureSchema);

module.exports = {
  Picture_Model,
};
