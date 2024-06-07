const { default: mongoose } = require("mongoose");
const { Events_Model } = require("../models/Events");
const { Student_Model } = require("../models/Students");
const ejs = require("ejs");
const path = require("path");
const { sendEmail } = require("../useful/sendpulse");

const event_reminderEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Events_Model.findById(id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const { studentID, date, time, description, link } = event;
  const student = await Student_Model.findById(studentID);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const { name, email } = student;

  const splitDate = date.split("-");
  const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

  try {
    const templatePath = path.join(__dirname, "../email/reminderClass.ejs");
    ejs.renderFile(
      templatePath,
      { name, date: formatDate, time, description, link },
      async (err, htmlMessage) => {
        if (err) {
          console.error("Erro ao renderizar o template:", err);
          return res
            .status(500)
            .json({ error: "Erro ao renderizar o template" });
        }

        const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
        const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

        try {
          sendEmail(htmlMessage, text, subject, name, email);
          sendEmail(
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            "Arthur",
            "arthurcardosocorp@gmail.com"
          );
          console.log("Email enviado com sucesso");
          res.status(200).json({ message: "Email enviado com sucesso" });

          event.emailSent = true;
          await event.save();
        } catch (emailError) {
          console.error("Erro ao enviar o email:", emailError);
          res.status(500).json({ error: "Erro ao enviar o email" });
        }
      }
    );
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const event_reminderEventAutomatic = async (req, res) => {
  const now = new Date();

  function get2last(numberString) {
    numberString = "0" + numberString;
    const finalResult = numberString.substring(numberString.length - 2);
    return finalResult;
  }

  const convertDate =
    now.getFullYear() +
    "-" +
    get2last(now.getMonth() + 1) +
    "-" +
    get2last(now.getDate());

  const events = await Events_Model.find({ date: convertDate });

  if (events.length == 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  for (let event of events) {
    const { studentID, date, time, description, link } = event;
    const [eventHour] = time.split(":").map(Number);
    if (now.getHours() + 1 !== eventHour) {
      continue;
    }
    const student = await Student_Model.findById(studentID);

    if (!student) {
      continue;
    }

    const { name, email } = student;

    const splitDate = date.split("-");
    const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

    try {
      const templatePath = path.join(__dirname, "../email/reminderClass.ejs");
      ejs.renderFile(
        templatePath,
        { name, date: formatDate, time, description, link },
        async (err, htmlMessage) => {
          if (err) {
            console.error("Erro ao renderizar o template:", err);
            return res
              .status(500)
              .json({ error: "Erro ao renderizar o template" });
          }

          const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
          const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

          try {
            if (event.status !== "desmarcado") {
              sendEmail(htmlMessage, text, subject, name, email);
              sendEmail(
                `Aula de ${name} às ${formatDate} às ${time}. E-mail enviado`,
                `${text} - ${name} às ${formatDate} às ${time}. E-mail enviado`,
                `${subject} - ${name}, ${formatDate}, ${time}.`,
                name,
                "arthurcardosocorp@gmail.com"
              );
              console.log(`Email de ${name} enviado com sucesso`);
              res.status(200).json({ message: "Email enviado com sucesso" });

              event.emailSent = true;
              await event.save();
            } else {
              sendEmail(
                `Aula de ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                `${text} - ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                `${subject} - ${name}, ${formatDate}, ${time}.`,
                name,
                "arthurcardosocorp@gmail.com"
              );
            }
          } catch (emailError) {
            console.error("Erro ao enviar o email:", emailError);
            res.status(500).json({ error: "Erro ao enviar o email" });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao processar o pedido:", error);
      res.status(500).json({ error: "Erro ao processar o pedido" });
    }
  }
};

const event_reminderGroupClassAutomatic = async (req, res) => {
  const now = new Date();

  function get2last(numberString) {
    numberString = "0" + numberString;
    const finalResult = numberString.substring(numberString.length - 2);
    return finalResult;
  }

  const convertDate =
    now.getFullYear() +
    "-" +
    get2last(now.getMonth() + 1) +
    "-" +
    get2last(now.getDate());

  const events = await Events_Model.find({
    date: convertDate,
    category: "Group Class",
  });

  if (events.length == 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  try {
    for (let event of events) {
      const { date, time, description, link } = event;
      const [eventHour] = time.split(":").map(Number);
      // if (now.getHours() + 3 !== eventHour) { continue }
      const students = await Student_Model.find();

      const emailPromises = students.map((student) => {
        const { name, email } = student;
        const splitDate = date.split("-");
        const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
        const templatePath = path.join(
          __dirname,
          "../email/reminderLiveClass.ejs"
        );

        return new Promise((resolve, reject) => {
          ejs.renderFile(
            templatePath,
            { name, date: formatDate, time, description, link },
            async (err, htmlMessage) => {
              if (err) {
                console.error("Erro ao renderizar o template:", err);
                return reject(new Error("Erro ao renderizar o template"));
              }
              const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
              const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
              try {
                await sendEmail(
                  htmlMessage,
                  text,
                  subject,
                  name,
                  email
                );
                console.log(`Email de ${name} enviado com sucesso`);
                resolve();
              } catch (emailError) {
                console.error(`Erro ao enviar o email: ${name}`, emailError);
                reject(new Error(`Erro ao enviar o email: ${name}`));
              }
            }
          );
        });
      });

      await Promise.all(emailPromises);
    }

    // Enviar email de confirmação ao professor após todos os emails serem enviados
    await sendEmail(
      "Email do group Class",
      "text",
      "Group Class Sent",
      'Teacher Arthur',
      "arthurcardosocorp@gmail.com"
    );

    res.status(200).json({ message: "Emails da aula em grupo enviados com sucesso" });

  } catch (error) {
    console.error("Erro ao enviar os emails:", error);
    res.status(500).json({ error: "Erro ao enviar os emails" });
  }
};

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
  const { today } = req.query;
  const hoje = new Date(today);

  const limit = new Date(hoje);
  limit.setDate(limit.getDate() + 11);

  const yesterday = new Date(hoje);
  yesterday.setDate(yesterday.getDate() - 3);

  const filtrarEventos = (eventsList) => {
    const eventosFiltrados = eventsList.filter(function (evento) {
      const dataEvento = new Date(evento.date);
      return dataEvento >= yesterday && dataEvento <= limit;
    });
    return eventosFiltrados;
  };

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    let events;
    if (student.permissions === "superadmin") {
      events = await Events_Model.find();
    } else {
      events = await Events_Model.find({
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
    }

    const eventsList = events.map((event) => {
      const dateObject = new Date(event.date);
      event.date = dateObject;
      return event;
    });

    const eventsFiltered = filtrarEventos(eventsList);

    return res.status(200).json({ eventsList: eventsFiltered });
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
    today.setHours(0, 0, 0, 0);

    const events = await Events_Model.find({
      studentID: id,
    }).sort({ date: 1 });

    let nextEvent = null;

    for (const event of events) {
      const eventDate = new Date(event.date);
      if (eventDate.getTime() === today.getTime()) {
        nextEvent = event;
        break;
      } else if (eventDate > today) {
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
  event_reminderEvent,
  //R
  events_seeAll,
  events_seeAllTutoringsFromOneStudent,
  events_seeOne,
  events_seeNext,
  //U
  events_editOne,
  events_editOneStatus,
  events_editOneTutoring,
  //D
  events_deleteOne,
  event_DeleteTutoring,

  //#
  event_reminderEventAutomatic,
  event_reminderGroupClassAutomatic,
};
