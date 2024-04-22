const { Events_Model } = require("../models/Events");
const { Student_Model } = require("../models/Students");

const event_New = async (req, res) => {
  const { studentID, link, date, time, category, description } = req.body;

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
        time,
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

const events_seeAll = async (req, res) => {
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

const events_seeOne = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Events_Model.findById(id);
    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const events_editOne = async (req, res) => {
  const { category, studentID, date, time, link, description, status } =
    req.body;
  const { id } = req.params;
  const editedEvent = await Events_Model.findById(id);
  const student = studentID ? await Student_Model.findById(studentID) : null;
  const studentName = studentID ? student.name + " " + student.lastname : null;
  try {
    if (!date || !link || !category || !status || !editedEvent) {
      res.status(500).json({ info: "informações faltantes" });
    } else {
      if (!editedEvent) {
        return res.status(500).json("Evento não encontado");
      } else {
        editedEvent.category = category;
        editedEvent.studentID = studentID ? studentID : null;
        editedEvent.student = studentID ? studentName : null;
        editedEvent.date = date;
        editedEvent.time = time;
        editedEvent.link = link;
        editedEvent.description = description ? description : "";
        editedEvent.status = status;
        editedEvent.save();
        res.status(200).json({ message: "Success!", editedEvent });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const events_editOneStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const editedEvent = await Events_Model.findById(id);
  try {
    if (!status) {
      res.status(500).json({ info: "informações faltantes" });
    } else {
      if (!editedEvent) {
        return res.status(500).json("Evento não encontado");
      } else {
        editedEvent.status = status;
        editedEvent.save();
        res.status(200).json({ message: "Success!", editedEvent });
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
  events_seeAll,
  events_seeOne,
  //U
  events_editOne, events_editOneStatus
  //D
};
