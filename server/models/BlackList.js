const mongoose = require("mongoose");
const { Schema } = mongoose;

const blSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d",
  },
});

const Black_List = mongoose.model("BlackList", blSchema);

module.exports = {
  Black_List,
};
