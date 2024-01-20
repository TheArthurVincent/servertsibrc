const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");
const formatDate = require("../useful/formulas");
const {
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

      const formatDate = (dataString) => {
        const data = new Date(dataString);
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const diaFormatado = dia < 10 ? `0${dia}` : dia;
        const mesFormatado = mes < 10 ? `0${mes}` : mes;
        return `${diaFormatado}/${mesFormatado}/${ano}`;
      }

      await nextClass.save();
      const formattedDate = formatDate(date);

      const html = await renderEmailTemplateScheduledClass(
        student.name,
        formattedDate,
        time,
        meetingUrl
      );

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
    const students = await Student_Model.find({ _id: { $in: studentIDs } });
    const validTutorings = tutorings.filter((tutoring) =>
      students.some(
        (student) => student._id.toString() === tutoring.studentID.toString()
      )
    );

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 4);

    let pastTutorings = [];
    let futureTutorings = [];

    validTutorings.forEach((tutoring) => {
      const tutoringDate = new Date(tutoring.date + " " + tutoring.time);
      if (tutoringDate < currentDate) {
        pastTutorings.push(tutoring);
      } else {
        futureTutorings.push(tutoring);
      }
    });

    pastTutorings.sort(
      (a, b) =>
        new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
    );
    futureTutorings.sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );

    const formattedPastTutorings = pastTutorings.map((tutoring, index) => {
      const student = students.find(
        (s) => s._id.toString() === tutoring.studentID.toString()
      );

      return {
        position: index,
        id: tutoring._id,
        studentID: tutoring.studentID,
        student: student.name + " " + student.lastname,
        dateTime: tutoring.date + " " + tutoring.time,
        meetingUrl: tutoring.meetingUrl,
      };
    });

    const formattedFutureTutorings = futureTutorings.map((tutoring, index) => {
      const student = students.find(
        (s) => s._id.toString() === tutoring.studentID.toString()
      );

      return {
        position: index,
        id: tutoring._id,
        studentID: tutoring.studentID,
        student: student.name + " " + student.lastname,
        dateTime: tutoring.date + " " + tutoring.time,
        meetingUrl: tutoring.meetingUrl,
      };
    });

    res.status(200).json({
      currentDate,
      status: `Sucesso! Foram encontradas ${validTutorings.length} aulas.`,
      pastTutorings: formattedPastTutorings,
      futureTutorings: formattedFutureTutorings,
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
