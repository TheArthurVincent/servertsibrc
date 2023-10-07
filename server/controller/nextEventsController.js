const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");

const nextTutoring_editNext = async (req, res) => {
  const { studentID, meetingUrl, date, time } = req.body;

  try {
    const nextClass = await NextTutoring_Model.findOne({ studentID });

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
      console.log(nextClass);
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
        student: student.name + " " + student.lastname + " | " + student.email, // Use the student data fetched above
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