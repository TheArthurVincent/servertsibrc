const { Events_Model } = require("../models/Events");
const { Student_Model } = require("../models/Students");

const event_New = async (req, res) => {
  const { studentID, link, date, category, description } = req.body;

  try {
    if (!link || !date || !category) {
      res.status(500).json({ Erro: "Informações faltantes" });
    } else {
      if (studentID) {
        var student = await Student_Model.findById(studentID);
        var studentName = student.name + " " + student.lastname;
      }
      const newEvent = await Events_Model({
        studentID,
        student: studentName ? studentName : null,
        description,
        link,
        date,
        category,
      });

      await newEvent.save();

      res.status(200).json({
        message: "Aula marcada",
        newEvent,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Evento não registrado" });
  }
};

const events_seeTutorings = async (req, res) => {
  try {
    const studentsList = await Student_Model.find();

    const filteredStudents = studentsList.filter(
      (student) => student.tutoringDays.length > 0
    );

    const formattedStudents = filteredStudents.map((student) => {
      return {
        student: student.name + " " + student.lastname,
        id: student._id,
        tutoringDays: student.tutoringDays,
      };
    });

    res.status(200).json({ eventsListTutorings: formattedStudents });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const events_seeGeneral = async (req, res) => {
  try {
    const events = await Events_Model.find();

    const eventsList = events.map((event) => {
      const dateObject = new Date(event.date);
      event.date = dateObject;
      return event;
    });

    res.status(200).json({ eventsList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  //C
  event_New,
  //R
  events_seeTutorings,
  events_seeGeneral,
  //U
  //D
};
