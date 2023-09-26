const Student_Model = require("../models/Students");

const signup = async (req, res, next) => {
  const newUser = await Student_Model.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

module.exports = {
  signup,
};
