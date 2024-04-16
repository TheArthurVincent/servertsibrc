const {
  NextTutoring_Model,
  NextLiveClass_Model,
} = require("../models/NextEvents");
const { Student_Model } = require("../models/Students");

const nextTutoring_editNext = async (req, res) => {
  const { studentID, meetingUrl, date, time } = req.body;

  const nextClass = await NextTutoring_Model.findOne({ studentID });

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
      nextClass.meetingUrl = meetingUrl ? meetingUrl : nextClass.meetingUrl;
      nextClass.date = date;
      nextClass.time = time ? time : nextClass.time;

      const formatDate = (dataString) => {
        const data = new Date(dataString);
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const diaFormatado = dia < 10 ? `0${dia}` : dia;
        const mesFormatado = mes < 10 ? `0${mes}` : mes;
        return `${diaFormatado}/${mesFormatado}/${ano}`;
      };

      await nextClass.save();
      const formattedDate = formatDate(date);

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
    const students = await Student_Model.find({ _id: { $in: studentIDs } });
    const validTutorings = tutorings.filter((tutoring) =>
      students.some(
        (student) => student._id.toString() === tutoring.studentID.toString()
      )
    );

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 4);

    let pastTutorings = [];
    let futureTutorings = [];

    validTutorings.forEach((tutoring) => {
      const tutoringDate = new Date(tutoring.date + " " + tutoring.time);
      if (tutoringDate < currentDate) {
        pastTutorings.push(tutoring);
      } else {
        futureTutorings.push(tutoring);
      }
    });

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
        student: student.name + " " + student.lastname,
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
        student: student.name + " " + student.lastname,
        dateTime: tutoring.date + " " + tutoring.time,
        meetingUrl: tutoring.meetingUrl,
      };
    });

    res.status(200).json({
      currentDate,
      status: `Sucesso! Foram encontradas ${validTutorings.length} aulas.`,
      pastTutorings: formattedPastTutorings,
      futureTutorings: formattedFutureTutorings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Nenhuma aula" });
  }
};

const nextLiveClass_postNext = async (req, res) => {
  const { title, meetingUrl, date, time } = req.body;
  const nxtLive = new NextLiveClass_Model({ title, meetingUrl, date, time });
  await nxtLive.save();
  res.status(201).json({ msg: "Aula registrada" });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

const nextLiveClass_getNext = async (req, res) => {
  try {
    const nxtLive = await NextLiveClass_Model.find();
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 4);

    let pastLives = [];
    let futureLives = [];

    nxtLive.forEach((live, index) => {
      const liveDate = new Date(live.date + " " + live.time);

      const liveDetails = {
        position: index,
        id: live._id,
        title: live.title, // assuming 'title' is a property of 'live' object
        dateTime: live.date + " " + live.time,
        meetingUrl: live.meetingUrl,
      };

      if (liveDate < currentDate) {
        pastLives.push(liveDetails);
      } else {
        futureLives.push(liveDetails);
      }
    });

    pastLives.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    futureLives.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    res.status(201).json({
      pastLiveClasses: pastLives,
      futureLiveClasses: futureLives,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Erro: "Erro ao obter informações das aulas" });
  }
};

module.exports = {
  //C
  nextTutoring_editNext,
  nextLiveClass_postNext,
  nextLiveClass_getNext,
  //R
  nextTutoring_seeAllTutorings,
  //U
  //D
};
