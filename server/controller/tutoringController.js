const { NextTutoring_Model } = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");
const { Tutoring_Model } = require("../models/Tutoring");
const {
  sendEmail,
  renderEmailTemplatePostedClass,
} = require("../useful/sendmail");

const tutoring_postOne = async (req, res) => {
  const { title, date, comments, attachments, studentID, videoUrl } = req.body;
  const student = await Student_Model.findById(studentID);

  const [day, month, year] = date.split("/");

  const newTutoring = new Tutoring_Model({
    title,
    date,
    monthYear: month + "/" + year,
    comments,
    videoUrl,
    attachments,
    studentID,
  });

  const html = await renderEmailTemplatePostedClass(student.name, date, title);

  try {
    await newTutoring.save();
    try {
      sendEmail(
        student.email,
        `Vídeo da aula particular do dia ${date} postado! | ARVIN ENGLISH SCHOOL`,
        html,
        "text/html"
      );
      sendEmail(
        "arvinenglishschool@gmail.com",
        `SUCESSO - Vídeo da aula de ${student.name}, do dia ${date} postada`,
        `SUCESSO - Vídeo da aula de ${student.name}, do dia ${date} postada`,
        "text/html"
      );
    } catch (e) {
      sendEmail(
        "arvinenglishschool@gmail.com",
        `FALHA - Vídeo da aula de ${student.name}, do dia ${date} não postada`,
        `FALHA - Vídeo da aula de ${student.name}, do dia ${date} não postada`,
        "text/html"
      );
      console.error("Erro ao enviar e-mail:", e);
    }
    res.status(201).json({
      status: "Aula particular salva",
      newTutoring,
    });
  } catch (error) {
    console.log(error);
    sendEmail(
      "arvinenglishschool@gmail.com",
      `SERVER ERROR - Vídeo da aula de ${student.name}, do dia ${date} não postada`,
      `SERVER ERROR - Vídeo da aula de ${student.name}, do dia ${date} não postada: ${error}`,
      "text/html"
    );
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

      // Verifica se o aluno com o ID existe
      const studentTheClassBelongsTo = students.find(
        (student) => student._id.toString() === studentID.toString()
      );

      if (!studentTheClassBelongsTo) {
        // Se o aluno não existe, apaga a aula
        deleteTutoring(tutoring._id);
        return; // Pula para a próxima iteração
      }

      // Verifica se o aluno já está no objeto
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

      // Adiciona a aula ao array correspondente ao aluno
      tutoringsByStudent[studentID].tutorings.push({
        id: tutoring._id,
        title: tutoring.title,
        date: tutoring.date,
        videoUrl: tutoring.videoUrl,
        comments: tutoring.comments,
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

// Função de exemplo para excluir uma aula
async function deleteTutoring(tutoringID) {
  try {
    await Tutoring_Model.findByIdAndDelete(tutoringID);
    console.log(`Aula com ID ${tutoringID} excluída`);
  } catch (error) {
    console.log(`Erro ao excluir aula com ID ${tutoringID}: ${error}`);
  }
}

// Função de exemplo para obter informações do aluno
function getStudentInfo(studentID) {
  // Substitua isso com a lógica real para obter as informações do aluno com base no ID
  return {
    name: "Nome do Aluno",
    lastname: "Sobrenome do Aluno",
    username: "Nome de Usuário do Aluno",
  };
}

const tutoring_getAllFromParticularStudent = async (req, res) => {
  const { studentID } = req.params;
  const tutoring = await Tutoring_Model.find({
    studentID,
  });
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
        comments: tutoring.comments,
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

  formattedTutoringFromParticularStudent.reverse();

  try {
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
