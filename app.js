const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const path = require("path");
const cors = require("cors");
const {
  members_getAll,
  members_getOne,
  member_postOne,
  member_deleteOne,
  member_editGeneralData,
  member_editPassword,
  member_editPermissions,
  member_login,
  loggedIn,
  loggedInADM,
  member_scoreUpdate,
  member_seeScore,
  member_resetMonth,
  members_getAllScores,
  member_getScore,
  members_getOneFullName,
  member_editPersonalPassword,
  members_getTotalAllScores,
  member_signUp,
  member_newRankingItem,
  member_getallRankingItem,
} = require("./server/controller/membersController");
const {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getOne,
  blogPosts_postOne,
  blogPosts_deleteOne,
} = require("./server/controller/blogPostsController");
const {
  tutoring_postOne,
  tutoring_getAllFromParticularStudent,
  tutoring_getAllFromParticularStudentInAParticularMonth,
  tutoring_getListOfAParticularMonthOfAStudent,
  tutoring_getNext,
  tutoring_getAll,
  tutoring_deleteOne,
} = require("./server/controller/tutoringController");
const {
  nextTutoring_editNext,
  nextTutoring_seeAllTutorings,
  nextLiveClass_postNext,
  nextLiveClass_getNext,
} = require("./server/controller/nextEventsController");
const {
  groupClasses_getOne,
  groupClasses_postOneClass,
  groupClasses_editOneClass,
  groupClasses_getClassesFromOneModule,
  groupClasses_deleteOneClass,
  groupClasses_getAllObjects,
} = require("./server/controller/groupClassesController");
const {
  material_postNew,
  material_deleteOne,
  material_editOne,
  material_getAll,
  material_getOne,
} = require("./server/controller/materialController");
const {
  event_New,
  events_editOne,
  events_seeAll,
  events_seeOne,
  events_editOneStatus,
  events_deleteOne,
  events_seeAllTutoringsFromOneStudent,
  events_editOneTutoring,
  event_NewTutoring,
  event_DeleteTutoring,
  events_seeNext,
  event_reminderEvent,
  event_reminderEventAutomatic,
} = require("./server/controller/eventsController");
const { sendEmail } = require("./server/useful/sendpulse");
const {
  flashcard_reviewCard,
  flashcard_createNew,
  flashcard_updateOne,
  flashcard_deleteCard,
  reviewList,
  flashcard_getOne,
  allCardsList,
} = require("./server/controller/flashCardsController");
const {
  homework_getAll,
  homework_done,
} = require("./server/controller/homeworkController");
const {
  courseClasses_postMultipleClasses,
  courseClasses_getAll,
  courseClasses_getOne,
  courseClasses_postNewCourse,
  courseClasses_postNewModule,
} = require("./server/controller/coursesController");

database();
app.use(express.json());
const mainroute = "/api/v1";

app.use(
  cors({
    origin: "*",
  })
);

app.use("/uploads", express.static(path.resolve(__dirname, "upload")));


// ** MEMBERS **
app.post(`${mainroute}/signupmember`, member_signUp);








// ** MEMBERS **
app.post(`${mainroute}/studentlogin/`, member_login);
app.get(`${mainroute}/students`, loggedInADM, members_getAll);
app.get(`${mainroute}/scoresranking`, loggedIn, members_getAllScores);
app.get(
  `${mainroute}/scorestotalranking`,
  loggedIn,
  members_getTotalAllScores
);
app.post(`${mainroute}/newitemhistory`, member_newRankingItem);
app.get(`${mainroute}/newitemhistory`, member_getallRankingItem);


app.get(`${mainroute}/score/:id`, loggedIn, member_getScore);
app.get(`${mainroute}/score/:id`, loggedIn, member_seeScore);
app.put(`${mainroute}/score/:id`, member_scoreUpdate);
app.get(`${mainroute}/student/:id`, loggedIn, members_getOne);
app.get(`${mainroute}/studentname/:id`, loggedIn, members_getOneFullName);
app.post(`${mainroute}/students`, loggedInADM, member_postOne);
app.put(`${mainroute}/students/:id`, loggedInADM, member_editGeneralData);
app.put(`${mainroute}/studentpassword/:id`, loggedInADM, member_editPassword);
app.put(
  `${mainroute}/studentperspassword/:id`,
  loggedIn,
  member_editPersonalPassword
);
app.put(
  `${mainroute}/studentpermissions/:id`,
  loggedInADM,
  member_editPermissions
);
app.put("/api/v1/resetmonthscoresecurethepoints", member_resetMonth);
// app.put("/api/v1/setweeklyclasses", async (req, res) => {
//   try {
//     const students = await Members_Model.find();
//     students.map((student) => {
//       student.weeklyClasses = 1;
//       student.save();
//     });
//     res.status(200).json({ students, status: "success" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: error, e: "Ocorreu um erro ao atualizar as aulas" });
//   }
// });

app.delete(`${mainroute}/students/:id`, loggedInADM, member_deleteOne);


















// ** COURSES **
// app.get(`${mainroute}/courses`, loggedIn, groupClasses_getCoursesTitles);
// app.get(`${mainroute}/course`, loggedIn, groupClasses_getOneCourse);
app.get(`${mainroute}/allgroupclasses`, loggedIn, groupClasses_getAllObjects);

// ** TUTORING - Aulas Particulares **
app.get(`${mainroute}/tutoring`, loggedIn, tutoring_getAll);
app.get(
  `${mainroute}/tutoring/:studentID`,
  loggedIn,
  tutoring_getAllFromParticularStudent
);
app.get(
  `${mainroute}/tutoringclassesofthemonth/`,
  loggedIn,
  tutoring_getAllFromParticularStudentInAParticularMonth
);
app.get(
  `${mainroute}/tutoringmonthyear/:studentID`,
  loggedIn,
  tutoring_getListOfAParticularMonthOfAStudent
);

app.delete(`${mainroute}/tutoring/:id`, loggedInADM, tutoring_deleteOne);
app.post(`${mainroute}/tutoring`, loggedInADM, tutoring_postOne);

// * events *
app.get(`${mainroute}/eventsgeneral/:id`, loggedIn, events_seeAll);
app.get(`${mainroute}/eventseenextttoring/:id`, loggedIn, events_seeNext);
app.post(`${mainroute}/event`, event_New);
app.post(`${mainroute}/tutoringevent`, event_NewTutoring);
app.delete(`${mainroute}/tutoringevent`, event_DeleteTutoring);
app.put(`${mainroute}/event/:id`, events_editOne);
app.put(`${mainroute}/eventstatus/:id`, events_editOneStatus);
app.delete(`${mainroute}/event/:id`, events_deleteOne);
app.post(`${mainroute}/eventreminder/:id`, event_reminderEvent);

app.get(`${mainroute}/event/:id`, events_seeOne);
app.get(
  `${mainroute}/tutoringsevents/:studentId`,
  events_seeAllTutoringsFromOneStudent
);
app.put(`${mainroute}/tutoringevent`, events_editOneTutoring);

// * Homework *
app.get(`${mainroute}/homework/:id`, loggedIn, homework_getAll);
app.put(`${mainroute}/homework/:id`, homework_done);
// app.put(`${mainroute}/homeworkallpending`,homework_allpending  );

// * Courses Management *
app.post(`${mainroute}/courseclasses`, courseClasses_postMultipleClasses);
app.post(`${mainroute}/course`, courseClasses_postNewCourse);
app.post(`${mainroute}/module`, courseClasses_postNewModule)

app.get(`${mainroute}/courses/:studentId`, courseClasses_getAll);
app.get(`${mainroute}/course/:id`, courseClasses_getOne);

// * group classes *
app.post(`${mainroute}/groupclass`, loggedInADM, groupClasses_postOneClass);
app.put(`${mainroute}/groupclass/:id`, loggedInADM, groupClasses_editOneClass);
app.get(
  `${mainroute}/groupclass/`,
  loggedIn,
  groupClasses_getClassesFromOneModule
);
app.get(`${mainroute}/groupclass/:id`, loggedIn, groupClasses_getOne);
app.delete(
  `${mainroute}/groupclass/:id`,
  loggedInADM,
  groupClasses_deleteOneClass
);

// ** NEXT CLASSES **
app.get(`${mainroute}/nexttutoring`, loggedIn, nextTutoring_seeAllTutorings);
app.post(`${mainroute}/nexttutoring`, loggedInADM, nextTutoring_editNext);
app.get(`${mainroute}/nexttutoring/:id`, loggedIn, tutoring_getNext);

// **Material**
app.post(`${mainroute}/material`, loggedInADM, material_postNew);
app.delete(`${mainroute}/material/:id`, loggedInADM, material_deleteOne);
app.put(`${mainroute}/material/:id`, loggedInADM, material_editOne);
app.get(`${mainroute}/material/`, loggedIn, material_getAll);
app.get(`${mainroute}/material/:id`, loggedIn, material_getOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, loggedIn, blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, loggedIn, blogPosts_getOne);
app.post(`${mainroute}/blogposts`, loggedInADM, blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_editOne);
app.delete(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_deleteOne);

// Flashcards
app.post(`${mainroute}/flashcard/:id`, flashcard_createNew);

app.get(`${mainroute}/flashcardfindone/:id`, loggedIn, flashcard_getOne);
app.get(`${mainroute}/cards/:id`, loggedIn, allCardsList);

app.get(`${mainroute}/flashcards/:id`, loggedIn, reviewList);

app.put(`${mainroute}/reviewflashcard/:id`, loggedIn, flashcard_reviewCard);
app.put(`${mainroute}/flashcard/:id`, flashcard_updateOne);
app.delete(`${mainroute}/flashcard/:id`, flashcard_deleteCard);

// Live Classes
app.post(`${mainroute}/liveclass`, nextLiveClass_postNext);
app.get(`${mainroute}/liveclasses`, loggedIn, nextLiveClass_getNext);
app.get(`${mainroute}/sendnotificationemail`, event_reminderEventAutomatic);
// app.get(`${mainroute}/sendgroupclassnotificationemail`, event_reminderGroupClassAutomatic);

app.get(`${mainroute}/testeemail`, async (req, res, next) => {
  let html = "<h1>Hello</h1>",
    text = "Hello world",
    suject = "teste",
    name = "Nik",
    email = "_nikmoliveira@gmail.com";

  await sendEmail(html, text, suject, name, email);

  res.send(200).end();
});

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
