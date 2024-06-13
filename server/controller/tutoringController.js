const { Homework_Model } = require("../models/Homework");
const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");
const { Tutoring_Model } = require("../models/Tutoring");
const { sendEmail } = require("../useful/sendpulse");
const ejs = require("ejs");
const path = require("path");

const tutoring_postOne = async (req, res) => {
  const { tutorings, description } = req.body;
  const savedTutorings = [];
  try {
    for (const tutoring of tutorings) {
      const { date, studentID, videoUrl, attachments } = tutoring;

      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleDateString("pt-BR");

      const newTutoring = new Tutoring_Model({
        date: formattedDate,
        videoUrl,
        studentID,
        attachments,
      });

      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + 7);

      const newHomework = new Homework_Model({
        dueDate,
        videoUrl,
        studentID,
        category: "tutoring",
        googleDriveLink: attachments,
        description,
        assignmentDate: new Date(date),
      });


      // Recuperar informações do aluno
      const student = await Student_Model.findById(studentID);
      const { name, lastname, email } = student;

      // Renderizar o template EJS
      const templatePath = path.join(__dirname, "../email/postedClass.ejs");
      ejs.renderFile(
        templatePath,
        { name, formattedDate },
        (err, htmlMessage) => {
          if (err) {
            console.error("Erro ao renderizar o template:", err);
            return;
          }

          const text = `Aula particular do dia ${formattedDate} postada no portal!`;
          const subject = `Aula particular do dia ${formattedDate} postada no portal!`;
          const nameTo = name + " " + lastname;
          const emailTo = email;
          // Enviar o email
          sendEmail(htmlMessage, text, subject, nameTo, emailTo);
          sendEmail(
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            "Arthur",
            "arthurcardosocorp@gmail.com"
          );
        }
      );

      // Salvar a tutoria
      await newTutoring.save();
      await newHomework.save()
      savedTutorings.push(newTutoring);
    }

    res.status(201).json({
      status: "Aula particular salva",
      savedTutorings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

const tutoring_deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTutoring = await Tutoring_Model.findByIdAndDelete(id);

    if (!deletedTutoring) {
      res.status(404).json({ Erro: "Aula não encontrada" });
      return;
    }

    res.status(200).json({ status: "Aula excluída com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Erro ao excluir aula" });
  }
};
const tutoring_getAll = async (req, res) => {
  try {
    const tutorings = await Tutoring_Model.find();
    const students = await Student_Model.find();
    const tutoringsByStudent = {};
    tutorings.forEach((tutoring) => {
      const studentID = tutoring.studentID;

      const studentTheClassBelongsTo = students.find(
        (student) => student._id.toString() === studentID.toString()
      );

      if (!studentTheClassBelongsTo) {
        deleteTutoring(tutoring._id);
        return;
      }

      if (!tutoringsByStudent[studentID]) {
        tutoringsByStudent[studentID] = {
          student: {
            id: studentID,
            name:
              studentTheClassBelongsTo.name +
              " " +
              studentTheClassBelongsTo.lastname,
            username: studentTheClassBelongsTo.username,
          },
          tutorings: [],
        };
      }

      tutoringsByStudent[studentID].tutorings.push({
        id: tutoring._id,
        title: tutoring.title,
        date: tutoring.date,
        videoUrl: tutoring.videoUrl,
        attachments: tutoring.attachments,
        createdAt: tutoring.createdAt,
        updatedAt: tutoring.updatedAt,
      });
    });

    const formattedTutoringsByStudent = Object.values(
      tutoringsByStudent
    ).filter((group) => group.tutorings.length > 0);

    res.status(200).json({
      status: "Aulas encontradas",
      formattedTutoringsByStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Não há aulas registradas" });
  }
};

async function deleteTutoring(tutoringID) {
  try {
    await Tutoring_Model.findByIdAndDelete(tutoringID);
    console.log(`Aula com ID ${tutoringID} excluída`);
  } catch (error) {
    console.log(`Erro ao excluir aula com ID ${tutoringID}: ${error}`);
  }
}

const tutoring_getAllFromParticularStudent = async (req, res) => {
  const { studentID } = req.params;
  try {
    const tutoring = await Tutoring_Model.find({ studentID });
    const studentTheClassBelongsTo = await Student_Model.findOne({
      _id: studentID,
    });

    const formattedTutoringFromParticularStudent = tutoring.map(
      (tutoring, index) => {
        return {
          position: index,
          id: tutoring._id,
          title: tutoring.title,
          date: tutoring.date,
          videoUrl: tutoring.videoUrl,
          attachments: tutoring.attachments,
          createdAt: tutoring.createdAt,
          updatedAt: tutoring.updatedAt,
          belongsTo: {
            name:
              studentTheClassBelongsTo.name +
              " " +
              studentTheClassBelongsTo.lastname,
            username: studentTheClassBelongsTo.username,
          },
        };
      }
    );

    formattedTutoringFromParticularStudent.sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA - dateB;
    });

    formattedTutoringFromParticularStudent.reverse();

    res.status(201).json({
      status: "Aulas encontradas",
      formattedTutoringFromParticularStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Este aluno não tem aulas registradas" });
  }
};

const tutoring_getListOfAParticularMonthOfAStudent = async (req, res) => {
  const { studentID } = req.params;
  try {
    const distinctMonthYears = await Tutoring_Model.distinct("monthYear", {
      studentID,
    });

    res.status(200).json({ distinctMonthYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nenhuma aula nesse mês.",
    });
  }
};

const tutoring_getAllFromParticularStudentInAParticularMonth = async (
  req,
  res
) => {
  const { studentID, monthYear } = req.body;
  try {
    const tutoring = await Tutoring_Model.find({
      studentID,
      monthYear,
    });

    const distinctMonthYears = await Tutoring_Model.distinct("monthYear", {
      studentID,
    });

    res.status(200).json({ tutoring, distinctMonthYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nenhuma aula nesse mês.",
    });
  }
};

const tutoring_getNext = async (req, res) => {
  const { id } = req.params;
  try {
    const nextTutoring = await NextTutoring_Model.findOne({
      studentID: id,
    });
    res.status(200).json({ nextTutoring: nextTutoring });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao encontrar a próxima aula" });
  }
};

module.exports = {
  tutoring_postOne,
  tutoring_getAllFromParticularStudent,
  tutoring_getListOfAParticularMonthOfAStudent,
  tutoring_getAllFromParticularStudentInAParticularMonth,
  tutoring_getNext,
  tutoring_getAll,
  tutoring_deleteOne,
};
