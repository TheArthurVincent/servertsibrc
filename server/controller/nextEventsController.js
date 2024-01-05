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

      // try {
      //   sendEmail(
      //     student.email,
      //     `Aula particular - ${formattedDate} às ${time}! | ARVIN ENGLISH SCHOOL`,
      //     html,
      //     "text/html"
      //   );
      //   sendEmail(
      //     "arvinenglishschool@gmail.com",
      //     `SUCESSO - E-mail enviado e aula particular de ${student.name}- ${formattedDate} às ${time} marcada`,
      //     `SUCESSO - E-mail enviado e aula particular de ${student.name}- ${formattedDate} às ${time} marcada - ${meetingUrl}`,
      //     "text/html"
      //   );
      // } catch (e) {
      //   sendEmail(
      //     "arvinenglishschool@gmail.com",
      //     `FALHA - E-mail NÃO enviado da aula particular de ${student.name}- ${formattedDate} às ${time} marcada`,
      //     `FALHA - E-mail NÃO enviado da aula particular de ${student.name}- ${formattedDate} às ${time} marcada - ${meetingUrl}`,
      //     "text/html"
      //   );
      //   console.error("Erro ao enviar e-mail:", e);
      // }

      res.status(200).json({
        message: "Aula marcada",
        tutoring: nextClass,
      });
    }
  } catch (error) {
    console.log(error);
    // sendEmail(
    //   "arvinenglishschool@gmail.com",
    //   `SERVER ERROR - E-mail NÃO enviado da aula particular de ${student.name}`,
    //   `SERVER ERROR - E-mail NÃO enviado da aula particular de ${student.name} - ${error}`,
    //   "text/html"
    // );
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
    let pastTutorings = [];
    let futureTutorings = [];

    validTutorings.forEach((tutoring) => {
      const tutoringDate = new Date(tutoring.date + " " + tutoring.time);

      // Comparar com o horário atual
      if (tutoringDate < currentDate) {
        pastTutorings.push(tutoring);
      } else {
        futureTutorings.push(tutoring);
      }
    });

    // Organizar as listas por data
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
        student: student.name + " " + student.lastname + " | " + student.email,
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
        student: student.name + " " + student.lastname + " | " + student.email,
        dateTime: tutoring.date + " " + tutoring.time,
        meetingUrl: tutoring.meetingUrl,
      };
    });

    res.status(200).json({
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
