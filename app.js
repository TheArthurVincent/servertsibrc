const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
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
} = require("./server/controller/studentsController");
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
} = require("./server/controller/tutoringController");
const {
  nextTutoring_editNext,
  nextTutoring_seeAllTutorings,
} = require("./server/controller/nextEventsController");
const {
  courses_postOneCourse,
  // courses_editOneCourse,
  // courses_deleteOneCourse,
  // courses_getAll,
  // courses_getOne,
  // courses_postOneModule,
  // courses_editOneModule,
} = require("./server/controller/coursesController");

database();
app.use(express.json());

const mainroute = "/api/v1";

app.use(
  cors({
    origin: "*",
  })
);

// ** COURSES **
app.post(`${mainroute}/courses`, courses_postOneCourse);
// app.get(`${mainroute}/courses`, courses_getAll);
// app.get(`${mainroute}/courses/:id`, courses_getOne);
// app.put(`${mainroute}/courses/:id`, courses_editOneCourse);
// app.delete(`${mainroute}/courses/:id`, courses_deleteOneCourse);
// app.post(`${mainroute}/moduleforcourse/:id`, courses_postOneModule);
// app.put(`${mainroute}/moduleforcourse/:course`, courses_editOneModule);

// ** NEXT CLASSES **
app.post(`${mainroute}/nexttutoring`, nextTutoring_editNext);
app.get(`${mainroute}/nexttutoring`, nextTutoring_seeAllTutorings);
app.get(`${mainroute}/nexttutoring/:id`, tutoring_getNext);

// ** STUDENTS **
app.post(`${mainroute}/students`, student_postOne);
app.post(`${mainroute}/studentlogin/`, student_login);

app.get(`${mainroute}/students`, /*loggedIn,*/ students_getAll);
app.get(`${mainroute}/student/:id`, /*loggedIn,*/ students_getOne);

app.put(`${mainroute}/students/:id`, /*loggedIn,*/ student_editGeneralData);
app.put(`${mainroute}/studentpassword/:id`, /*loggedIn,*/ student_editPassword);
app.put(
  `${mainroute}/studentpermissions/:id`,
  /*loggedIn,*/
  student_editPermissions
);

app.delete(`${mainroute}/students/:id`, /*loggedIn,*/ student_deleteOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, /*loggedIn,*/ blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, /*loggedIn,*/ blogPosts_getOne);

app.post(`${mainroute}/blogposts`, /*loggedIn,*/ blogPosts_postOne);

app.put(`${mainroute}/blogposts/:id`, /*loggedIn,*/ blogPosts_editOne);

app.delete(`${mainroute}/blogposts/:id`, /*loggedIn,*/ blogPosts_deleteOne);

// ** TUTOTING - Aulas Particulares **
app.post(`${mainroute}/tutoring`, /*loggedIn,*/ tutoring_postOne);

app.get(
  `${mainroute}/tutoring/:studentID`,
  /*loggedIn,*/ tutoring_getAllFromParticularStudent
);
app.get(
  `${mainroute}/tutoringclassesofthemonth/`,
  /*loggedIn,*/ tutoring_getAllFromParticularStudentInAParticularMonth
);
app.get(
  `${mainroute}/tutoringmonthyear/:studentID`,
  /*loggedIn,*/ tutoring_getListOfAParticularMonthOfAStudent
);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
