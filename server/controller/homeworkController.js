const { Homework_Model } = require("../models/Homework");
const { Members_Model } = require("../models/Members");
const homework_getAll = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Members_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    const tutoringHomework = await Homework_Model.find({ studentID: id });
    const groupClassHomework = await Homework_Model.find({ category: "groupclass" });

    const tutoringHomeworkList = tutoringHomework.sort(
      (a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate)
    );

    const updatedGroupClassHomeworkList = groupClassHomework.map(homework => {
      const isTrue = homework.studentsWhoDidIt.includes(id)
      if (!isTrue) {
        return { ...homework._doc, status: "pending" }; // _doc é usado para acessar os dados do documento do Mongoose
      } else {
        return { ...homework._doc, status: "done" }; // _doc é usado para acessar os dados do documento do Mongoose
      }
    }).sort(
      (a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate)
    );

    tutoringHomework.reverse();
    groupClassHomework.reverse()

    res.status(200).json({
      tutoringHomeworkList,
      groupClassHomeworkList: updatedGroupClassHomeworkList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nenhum homework encontrado" });
  }
};

const homework_done = async (req, res) => {
  const { id } = req.params;
  const { tutoringId, score } = req.body;

  try {
    const student = await Members_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    const tutoringHomework = await Homework_Model.findById(tutoringId);
    if (tutoringHomework && tutoringHomework.studentID == id) {
      tutoringHomework.status = "done";
      await tutoringHomework.save();



      const timeline = {
        date: new Date(),
        score,
        description: "Homework done",
        type: "Tutoring",
      };

      student.eventsTimeline.push(timeline);
      student.monthlyScore += score;
      student.totalScore += score;
      await student.save();

    } else {
      const groupClassHomework = await Homework_Model.findById(tutoringId);
      if (groupClassHomework) {
        groupClassHomework.studentsWhoDidIt.push(id);
        await groupClassHomework.save();


        const timeline = {
          date: new Date(),
          score,
          description: "Group class homework done",
          type: "Group class",
        };

        student.eventsTimeline.push(timeline);
        student.monthlyScore += score;
        student.totalScore += score;

        await student.save();
      }
    }

    res.status(200).json("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nenhum homework encontrado" });
  }
};


const homework_allpending = async (req, res) => {

  try {

    const tutoringHomework = await Homework_Model.find();
    tutoringHomework.map(async (tt) => {

      tt.category == "tutoring" ? tutoringHomework.status = "pending" : null;
      await tt.save();

    })

    res.status(200).json("success");


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nenhum homework encontrado" });
  }
}


module.exports = {
  homework_getAll,
  homework_done, homework_allpending
};
