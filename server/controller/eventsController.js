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
  const { id } = req.params;

  const filtrarEventos = (eventsList) => {
    var hoje = new Date();
    var ontem = (hoje.getDate() - 1);
    var limite = new Date();
    limite.setDate(hoje.getDate() + 15);

    var eventosFiltrados = eventsList.filter(function (evento) {
      var dataEvento = new Date(evento.date);
      return dataEvento >= ontem && dataEvento <= limite;
    });

    return eventosFiltrados;
  }
  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.permissions === "superadmin") {
      const events = await Events_Model.find();
      const eventsList = events.map((event) => {
        const dateObject = new Date(event.date);
        event.date = dateObject;
        return event;
      });


      const events31 = filtrarEventos(eventsList);
      return res.status(200).json({ eventsList: events31 });
    } else {
      const events = await Events_Model.find({
        $or: [
          { category: "Group Class" },
          {
            $and: [
              { studentID: id },
              { category: { $in: ["Tutoring", "Rep", "Prize Class"] } },
            ],
          },
        ],
      });
      const eventsList = events.map((event) => {
        const dateObject = new Date(event.date);
        event.date = dateObject;
        return event;
      });
      const events31 = filtrarEventos(eventsList);
      return res.status(200).json({ eventsList: events31 });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const events_seeNext = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define a hora para 00:00:00

    const events = await Events_Model.find({
      studentID: id,
    }).sort({ date: 1 }); // Ordena os eventos por data em ordem crescente

    let nextEvent = null;

    for (const event of events) {
      const eventDate = new Date(event.date);
      if (eventDate.getTime() === today.getTime()) {
        // Se a data do evento for hoje, atribua o evento a nextEvent e saia do loop
        nextEvent = event;
        break;
      } else if (eventDate > today) {
        // Se a data do evento for após hoje, atribua o evento a nextEvent e saia do loop
        nextEvent = event;
        break;
      }
    }

    console.log(nextEvent);

    return res.status(200).json({ event: nextEvent });
  } catch (error) {
    console.error("Error fetching events:", error);
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
        editedEvent.edited ? (editedEvent.edited = true) : null;
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
        editedEvent.edited = true;
        editedEvent.save();
        res.status(200).json({ message: "Success!", editedEvent });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/// tutorings
const event_NewTutoring = async (req, res) => {
  const { day, time, link, studentID } = req.body;
  try {
    if (!day || !time || !link || !studentID) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };
    const student = await Student_Model.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const newTutoring = {
      day,
      time: formatTime(time),
      link,
      edited: false,
      student: studentID,
      id: new mongoose.Types.ObjectId(),
    };

    student.tutoringDays.push(newTutoring);
    await student.save();

    const getNextDayOfWeek = (dayOfWeek, fromDate) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const targetDay = daysOfWeek.indexOf(dayOfWeek);
      const currentDay = fromDate.getDay();
      const daysUntilTarget = targetDay - currentDay;
      const nextDate = new Date(fromDate);
      nextDate.setDate(fromDate.getDate() + daysUntilTarget);
      return nextDate;
    };

    const today = new Date();
    const nextWeekDay = getNextDayOfWeek(day, today);

    const nextFewWeeks = [];
    for (let i = 0; i < 42; i++) {
      const nextWeek = new Date(
        nextWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000 * i
      );
      nextFewWeeks.push(nextWeek);
    }

    const eventsPromises = nextFewWeeks.map(async (nextWeek) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const nextWeekDaySameDay = new Date(nextWeek);

      nextWeekDaySameDay.setDate(
        nextWeekDaySameDay.getDate() +
        ((daysOfWeek.indexOf(day) + 7 - nextWeekDaySameDay.getDay()) % 7)
      );

      const eventDate = new Date(
        nextWeekDaySameDay.getFullYear(),
        nextWeekDaySameDay.getMonth(),
        nextWeekDaySameDay.getDate(),
        time.split(":")[0],
        time.split(":")[1]
      );
      const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(":");
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      };

      const newEvents = await Events_Model({
        studentID,
        student: student.name + " " + student.lastname,
        description: null,
        edited: false,
        link,
        date: eventDate.toISOString().slice(0, 10),
        time: formatTime(time),
        category: "Tutoring",
        tutoringID: newTutoring.id,
      });

      await newEvents.save();
      return newEvents;
    });
    /////////
    return res.status(200).json({ message: "Success", student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const events_seeAllTutoringsFromOneStudent = async (req, res) => {
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
    if (id) {
      await Events_Model.deleteMany({
        tutoringID: id,
        edited: false,
      });
      const getNextDayOfWeek = (dayOfWeek, fromDate) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const targetDay = daysOfWeek.indexOf(dayOfWeek);
        const currentDay = fromDate.getDay();
        const daysUntilTarget = targetDay - currentDay;
        const nextDate = new Date(fromDate);
        nextDate.setDate(fromDate.getDate() + daysUntilTarget);
        return nextDate;
      };

      const today = new Date();
      const nextWeekDay = getNextDayOfWeek(day, today);

      const nextFewWeeks = [];
      for (let i = 0; i < 42; i++) {
        const nextWeek = new Date(
          nextWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000 * i
        );
        nextFewWeeks.push(nextWeek);
      }

      const eventsPromises = nextFewWeeks.map(async (nextWeek) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const nextWeekDaySameDay = new Date(nextWeek);

        nextWeekDaySameDay.setDate(
          nextWeekDaySameDay.getDate() +
          ((daysOfWeek.indexOf(day) + 7 - nextWeekDaySameDay.getDay()) % 7)
        );

        const eventDate = new Date(
          nextWeekDaySameDay.getFullYear(),
          nextWeekDaySameDay.getMonth(),
          nextWeekDaySameDay.getDate(),
          time.split(":")[0],
          time.split(":")[1]
        );

        const formatTime = (timeStr) => {
          const [hours, minutes] = timeStr.split(":");
          return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
        };

        const newEvents = await Events_Model({
          studentID,
          student: student.name + " " + student.lastname,
          description: null,
          link,
          date: eventDate.toISOString().slice(0, 10),
          time: formatTime(time),
          category: "Tutoring",
          tutoringID: newTutoring.id,
        });

        await newEvents.save();
        return newEvents;
      });
    }
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const event_DeleteTutoring = async (req, res) => {
  const { id, studentID, day, time } = req.body;
  try {
    if (!id || !studentID || !day || !time) {
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

    await Events_Model.deleteMany({
      tutoringID: id,
    });

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
  events_seeAllTutoringsFromOneStudent,
  events_seeOne, events_seeNext,
  //U
  events_editOne,
  events_editOneStatus,
  events_editOneTutoring,
  //D
  events_deleteOne,
  event_DeleteTutoring,
};
