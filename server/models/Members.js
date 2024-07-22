const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    password: { type: String, required: true },
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: false,
      lowercase: true,
      validade: [validator.isEmail, "Escolha um e-mail válido"],
    },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    doc: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    eventsTimeline: {
      type: Array,
      default: [],
      required: false,
    },
    dateOfBirth: { type: String, required: true },
    permissions: { type: String, required: false, default: "member" },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

const Members_Model = mongoose.model("Members", memberSchema);

module.exports = { Members_Model };
