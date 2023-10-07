const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");
const { Tutoring_Model } = require("../models/Tutoring");

const tutoring_postOne = async (req, res) => {
  const { title, date, comments, attachments, studentID, videoUrl } = req.body;

  const [day, month, year] = date.split("/");

  const newTutoring = new Tutoring_Model({
    title,
    date,
    monthYear: month + "/" + year,
    comments,
    videoUrl,
    attachments,
    studentID,
  });
  try {
    await newTutoring.save();
    res.status(201).json({
      status: "Aula particular salva",
      newTutoring,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

const tutoring_getAllFromParticularStudent = async (req, res) => {
  const { studentID } = req.params;
  const tutoring = await Tutoring_Model.find({
    studentID,
  });
  const studentTheClassBelongsTo = await Student_Model.findOne({
    _id: studentID,
  });

  const formattedTutoringFromParticularStudent = tutoring.map(
    (tutoring, index) => {
      return {
        position: index,
        id: tutoring._id,
        title: tutoring.title,
        date: tutoring.date,
        videoUrl: tutoring.videoUrl,
        comments: tutoring.comments,
        attachments: tutoring.attachments,
        createdAt: tutoring.createdAt,
        updatedAt: tutoring.updatedAt,
        belongsTo: {
          name:
            studentTheClassBelongsTo.name +
            " " +
            studentTheClassBelongsTo.lastname,
          username: studentTheClassBelongsTo.username,
        },
      };
    }
  );

  formattedTutoringFromParticularStudent.reverse();

  try {
    res.status(201).json({
      status: "Aulas encontradas",
      formattedTutoringFromParticularStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Este aluno não tem aulas registradas" });
  }
};

const tutoring_getListOfAParticularMonthOfAStudent = async (req, res) => {
  const { studentID } = req.params;
  try {
    const distinctMonthYears = await Tutoring_Model.distinct("monthYear", {
      studentID,
    });

    res.status(200).json({ distinctMonthYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nenhuma aula nesse mês.",
    });
  }
};

const tutoring_getAllFromParticularStudentInAParticularMonth = async (
  req,
  res
) => {
  const { studentID, monthYear } = req.body;
  try {
    const tutoring = await Tutoring_Model.find({
      studentID,
      monthYear,
    });

    const distinctMonthYears = await Tutoring_Model.distinct("monthYear", {
      studentID,
    });

    res.status(200).json({ tutoring, distinctMonthYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nenhuma aula nesse mês.",
    });
  }
};

const tutoring_getNext = async (req, res) => {
  const { id } = req.params;
  try {
    const nextTutoring = await NextTutoring_Model.findOne({
      studentID: id,
    });
    res.status(200).json({ nextTutoring: nextTutoring });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao encontrar a próxima aula" });
  }
};

module.exports = {
  tutoring_postOne,
  tutoring_getAllFromParticularStudent,
  tutoring_getListOfAParticularMonthOfAStudent,
  tutoring_getAllFromParticularStudentInAParticularMonth,
  tutoring_getNext,
};
