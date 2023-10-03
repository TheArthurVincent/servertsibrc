const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");

const nextTutoring_editNext = async (req, res) => {
  const { studentID, meetingUrl, date } = req.body;

  try {
    const nextClass = await NextTutoring_Model.findOne({ studentID });

    if (!nextClass) {
      const newNextClass = new NextTutoring_Model({
        studentID,
        meetingUrl,
        date,
      });
      await newNextClass.save();

      res.status(200).json({
        message: "Nova aula registrada",
        updatedUser: newNextClass,
      });
    } else {
      nextClass.meetingUrl = meetingUrl;
      nextClass.date = date;

      await nextClass.save();

      res.status(200).json({
        message: "Aula marcada",
        updatedUser: nextClass,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

const nextLiveClass_editNext = async (req, res) => {
  const { title, comments, studentID, meetingUrl, date } = req.body;

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

module.exports = {
  //C
  nextTutoring_editNext,
  nextLiveClass_editNext,
  //R
  //U
  //D
};
