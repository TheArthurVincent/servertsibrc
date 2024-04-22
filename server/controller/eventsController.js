const { default: mongoose } = require("mongoose");
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
const events_deleteOne = async (req, res) => {
  const { id } = req.params;
  const eventToDelete = await Events_Model.findById(id);
  try {
    if (!eventToDelete) {
      return res.status(500).json("Evento não encontado");
    } else {
      eventToDelete.deleteOne();
      res.status(200).json({ message: "Success!", eventToDelete });
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

const events_seeAllTutorings = async (req, res) => {
  const { studentId } = req.params;
  try {
    if (!studentId) {
      res.status(500).json({ message: "Informações faltantes" });
    } else {
      const student = await Student_Model.findById(studentId);
      if (!student) {
        res.status(500).json({ message: "Aluno não encontrado" });
      } else {
        const tutorings = student.tutoringDays;
        res.status(200).json({ tutorings });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const event_DeleteTutoring = async (req, res) => {
  const { id, studentID } = req.body;
  try {
    if (!id || !studentID) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    const student = await Student_Model.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    student.tutoringDays = student.tutoringDays.filter(
      (tutoring) => tutoring.id.toString() !== id
    );

    await student.save();
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const events_editOneTutoring = async (req, res) => {
  const { id, day, time, link, studentID } = req.body;
  try {
    if (!id || !day || !time || !link || !studentID) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    const student = await Student_Model.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    student.tutoringDays = student.tutoringDays.filter(
      (tutoring) => tutoring.id.toString() !== id
    );

    const newTutoring = {
      day,
      time,
      link,
      id: new mongoose.Types.ObjectId(),
    };
    student.tutoringDays.push(newTutoring);

    await student.save();
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const event_NewTutoring = async (req, res) => {
  const { day, time, link, studentID } = req.body;
  try {
    if (!day || !time || !link || !studentID) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    const student = await Student_Model.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const newTutoring = {
      day,
      time,
      link,
      student: studentID,
      id: new mongoose.Types.ObjectId(),
    };
    student.tutoringDays.push(newTutoring);

    await student.save();
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  //C
  event_New,
  event_NewTutoring,
  //R
  events_seeAll,
  events_seeAllTutorings,
  events_seeOne,
  //U
  events_editOne,
  events_editOneStatus,
  events_editOneTutoring,
  //D
  events_deleteOne, event_DeleteTutoring
};
