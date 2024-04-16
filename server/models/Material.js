const mongoose = require("mongoose");
const { Schema } = mongoose;

const materialSchem = new Schema({
  title: { type: String, required: true },
  img: {
    type: String,
    default:
      "https://ik.imagekit.io/vjz75qw96/assets/capas/default?updatedAt=1713292996742",
    required: false,
  },
  link: { type: String, required: true },
  category: { type: String, required: true },
});

const Material_Model = mongoose.model("Material", materialSchem);

module.exports = {
  Material_Model,
};
