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
const events_editOne = async (req, res) => {
  const { category, studentID, date, link, description } = req.body;

  const dateDate = new Date(date);
  const editedEvent = await Events_Model.findOne({ link, date: { $eq: dateDate.toISOString() } });


  try {
    if (!date || !link || !category) {
      res.status(500).json({ info: "informações faltantes" });
    } else if (!editedEvent) {
      if (!studentID) {
        res.status(500).json({
          message: "Informações faltantes",
        });
      } else {
        var student = await Student_Model.findById(studentID);
        var studentName = student.name + " " + student.lastname;

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
    } else {
      if (!editedEvent) {
        return res.status(500).json("Evento não encontado");
      } else {
        editedEvent.category !== category
          ? null
          : (editedEvent.category = category);
        editedEvent.studentID !== studentID
          ? null
          : (editedEvent.studentID = studentID);
        editedEvent.student !== student
          ? null
          : (editedEvent.student = studentName);
        editedEvent.date !== date ? null : (editedEvent.date = date);
        editedEvent.link !== link ? null : (editedEvent.link = link);
        editedEvent.description !== description
          ? null
          : (editedEvent.description = description);
        editedEvent.save();
        res.status(200).json({ editedEvent });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const events_editOneStatus = async (req, res) => {
  const { category, studentID, date, link, description, status } = req.body;
  const editedEvent = await Events_Model.findOne({ link, date });

  try {
    if (!date || !link || !category || !status) {
      res.status(500).json({ info: "informações faltantes" });
    } else if (!editedEvent) {
      if (!studentID) {
        res.status(500).json({
          message: "Aula marcada",
          newEvent,
        });
      } else {
        var student = await Student_Model.findById(studentID);
        var studentName = student.name + " " + student.lastname;

        const newEvent = await Events_Model({
          studentID,
          student: studentName ? studentName : null,
          description,
          link,
          date,
          category,
          status,
        });
        await newEvent.save();
        res.status(200).json({
          message: "Aula marcada",
          newEvent,
        });
      }

      await newEvent.save();

      res.status(200).json({
        message: "Aula marcada",
        newEvent,
      });
    } else {
      if (!editedEvent) {
        return res.status(500).json("Evento não encontado");
      } else {
        editedEvent.status !== status ? null : (editedEvent.status = status);
        editedEvent.save();
        res.status(200).json({ editedEvent });
      }
    }
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
  events_editOne,
  //D
};
