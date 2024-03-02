const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const path = require("path");
const cors = require("cors");
const {
  students_getAll,
  students_getOne,
  student_postOne,
  student_deleteOne,
  student_editGeneralData,
  student_editPassword,
  student_editPermissions,
  student_login,
  loggedIn,
  loggedInADM,
  students_postPicture,
  student_getPicture,
  student_scoreUpdate,
  student_seeScore,
  student_resetMonth,
  students_getAllScores,
  student_getScore,
  students_getOneFullName,
  student_editPersonalPassword,
} = require("./server/controller/studentsController");
const {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getOne,
  blogPosts_postOne,
  blogPosts_deleteOne,
  tbBlogPosts_getAll,
  tbBlogPosts_postOne,
  tbBlogPosts_editOne,
  tbBlogPosts_deleteOne,
  tbBlogPosts_getOne,
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
  courses_getOne,
  courses_postOneClass,
  courses_editOneClass,
  courses_getClassesFromOneModule,
  courses_deleteOneClass,
  courses_getCoursesTitles,
  courses_getOneCourse,
  courses_getAllObjects,
} = require("./server/controller/coursesController");

database();
app.use(express.json());
const upload = require("./db/multer");
const mainroute = "/api/v1";

app.use(
  cors({
    origin: "*",
  })
);

app.use("/uploads", express.static(path.resolve(__dirname, "upload")));

// ** COURSES **
app.get(`${mainroute}/courses`, loggedIn, courses_getCoursesTitles);
app.get(`${mainroute}/course`, loggedIn, courses_getOneCourse);
app.get(`${mainroute}/allcourseobjects`, loggedInADM, courses_getAllObjects);

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

// * classes *
app.post(`${mainroute}/courseclass`, loggedInADM, courses_postOneClass);
app.put(`${mainroute}/courseclass/:id`, loggedInADM, courses_editOneClass);
app.get(`${mainroute}/courseclass/`, loggedIn, courses_getClassesFromOneModule);
app.get(`${mainroute}/courseclass/:id`, loggedIn, courses_getOne);
app.delete(`${mainroute}/courseclass/:id`, loggedInADM, courses_deleteOneClass);

// ** NEXT CLASSES **
app.get(`${mainroute}/nexttutoring`, loggedIn, nextTutoring_seeAllTutorings);
app.post(`${mainroute}/nexttutoring`, loggedInADM, nextTutoring_editNext);
app.get(`${mainroute}/nexttutoring/:id`, loggedIn, tutoring_getNext);

// ** STUDENTS **
app.post(`${mainroute}/studentlogin/`, student_login);
app.get(`${mainroute}/students`, loggedInADM, students_getAll);

app.get(`${mainroute}/scoresranking`, loggedIn, students_getAllScores);
app.get(`${mainroute}/score/:id`, loggedIn, student_getScore);
app.get(`${mainroute}/score/:id`, loggedIn, student_seeScore);
app.put(`${mainroute}/score/:id`,/* loggedIn,*/ student_scoreUpdate);

app.get(`${mainroute}/student/:id`, loggedIn, students_getOne);
app.get(`${mainroute}/studentname/:id`, loggedIn, students_getOneFullName);

app.post(`${mainroute}/students`, loggedInADM, student_postOne);
app.put(`${mainroute}/students/:id`, loggedInADM, student_editGeneralData);
app.put(`${mainroute}/studentpassword/:id`, loggedInADM, student_editPassword);
app.put(
  `${mainroute}/studentperspassword/:id`,
  loggedIn,
  student_editPersonalPassword
);
app.put(
  `${mainroute}/studentpermissions/:id`,
  loggedInADM,
  student_editPermissions
);
app.post(
  "/api/v1/studentpicture/:id",
  upload.single("file"),
  students_postPicture
);
app.get(
  "/api/v1/studentpicture/:id",
  /*upload.single("file"),*/ student_getPicture
);

app.put("/api/v1/resetmonth/", /* loggedIn, */ student_resetMonth);

app.delete(`${mainroute}/students/:id`, loggedInADM, student_deleteOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, loggedIn, blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, loggedIn, blogPosts_getOne);
app.post(`${mainroute}/blogposts`, loggedInADM, blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_editOne);
app.delete(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_deleteOne);

// Live Classes
app.post(`${mainroute}/liveclass`, nextLiveClass_postNext);
app.get(`${mainroute}/liveclasses`, loggedIn, nextLiveClass_getNext);

// Talking Business
app.get(`${mainroute}/tbblogposts`, tbBlogPosts_getAll);
app.get(`${mainroute}/tbblogpost/:id`, tbBlogPosts_getOne);
app.post(`${mainroute}/tbblogposts`, tbBlogPosts_postOne);
app.put(`${mainroute}/tbblogposts/:id`, tbBlogPosts_editOne);
app.delete(`${mainroute}/tbblogposts/:id`, tbBlogPosts_deleteOne);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
