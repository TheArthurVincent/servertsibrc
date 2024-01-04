const mongoose = require("mongoose");
const { Schema } = mongoose;

const classSchema = new Schema({
  classTitle: { type: String, required: true },
  description: { type: String, required: false },
  videoUrl: { type: String, required: false },
  googleDriveLink: { type: String, required: false },
  moduleTitle: { type: String, required: true },
  courseTitle: { type: String, required: true },
  partner: { type: Number, required: false, default: 0 },
  attachment: { type: String, required: false },
  srcVideos: [
    {
      title: { type: String, required: false },
      url: { type: String, required: false },
      description: { type: String, required: false },
    },
  ],
  srcAttachments: [
    {
      title: { type: String, required: false },
      src: { type: String, required: false },
      description: { type: String, required: false },
    },
  ],
});

const Class_Model = mongoose.model("Class", classSchema);

module.exports = {
  Class_Model,
};
