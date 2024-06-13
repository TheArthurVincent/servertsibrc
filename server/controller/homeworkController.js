const { Homework_Model } = require("../models/Homework");
const { Student_Model } = require("../models/Students");

const homework_getAll = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    const tutoringHomeworkList = await Homework_Model.find({ studentID: id });

    const groupClassHomeworkList = await Homework_Model.find({
      category: "groupclass",
    });

    res.status(200).json({ tutoringHomeworkList, groupClassHomeworkList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, listOfPosts: "Nenhum homework encontrado" });
  }
};

module.exports = {
  homework_getAll,
};
