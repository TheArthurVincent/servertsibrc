const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");
const formatDate = require("../useful/formulas");
const {
  sendEmail,
  renderEmailTemplateScheduledClass,
} = require("../useful/sendmail");

const nextTutoring_editNext = async (req, res) => {
  const { studentID, meetingUrl, date, time } = req.body;

  const nextClass = await NextTutoring_Model.findOne({ studentID });
  const student = await Student_Model.findById(studentID);

  try {
    if (!nextClass) {
      const newNextClass = new NextTutoring_Model({
        studentID,
        meetingUrl,
        date,
        time,
      });
      await newNextClass.save();

      res.status(200).json({
        message: "Nova aula registrada",
        tutoring: newNextClass,
      });
    } else {
      nextClass.meetingUrl = meetingUrl;
      nextClass.date = date;
      nextClass.time = time;

      await nextClass.save();
      const formattedDate = formatDate(date);

      const html = await renderEmailTemplateScheduledClass(
        student.name,
        formattedDate,
        time,
        meetingUrl
      );

      try {
        sendEmail(
          student.email,
          `Aula particular - ${formattedDate} às ${time}! | ARVIN ENGLISH SCHOOL`,
          html,
          "text/html"
        );
      } catch (e) {
        console.error("Erro ao enviar e-mail:", e);
      }

      res.status(200).json({
        message: "Aula marcada",
        tutoring: nextClass,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

const nextTutoring_seeAllTutorings = async (req, res) => {
  try {
    const tutorings = await NextTutoring_Model.find();
    const studentIDs = tutorings.map((tutoring) => tutoring.studentID);

    const students = await Promise.all(
      studentIDs.map(async (studentID) => {
        const student = await Student_Model.findById(studentID);
        return student;
      })
    );

    const formattedTutorings = tutorings.map((tutoring, index) => {
      const student = students.find(
        (s) => s._id.toString() === tutoring.studentID.toString()
      );

      return {
        position: index,
        id: tutoring._id,
        studentID: tutoring.studentID,
        student: student.name + " " + student.lastname + " | " + student.email,
        dateTime: tutoring.date + " " + tutoring.time,
        meetingUrl: tutoring.meetingUrl,
      };
    });

    res.status(200).json({
      status: `Sucesso! Foram encontradas ${formattedTutorings.length} aulas.`,
      listOfTutorings: formattedTutorings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Nenhuma aula" });
  }
};

const nextLiveClass_editNext = async (req, res) => {
  const { title, comments, studentID, meetingUrl, date, time } = req.body;

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
  nextTutoring_seeAllTutorings,
  //U
  //D
};
