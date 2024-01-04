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
} = require("./server/controller/nextEventsController");
const {
  courses_postOneCourse,
  courses_getAll,
  courses_getOne,
  courses_editOneCourse,
  courses_deleteOneCourse,
  courses_postOneModule,
  courses_editOneModule,
  courses_deleteOneModule,
  courses_getModulesFromOneCourse,
  courses_postOneClass,
  courses_editOneClass,
  courses_getClassesFromOneModule,
  courses_deleteOneClass,
  courses_getCoursesTitles,
  courses_getOneCourse,
  deleteAllBut,
  courses_getAllObjects,
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
app.get(`${mainroute}/courses`, courses_getCoursesTitles);
app.get(`${mainroute}/course`, courses_getOneCourse);
app.get(`${mainroute}/allcourseobjects`, courses_getAllObjects);

app.post(`${mainroute}/courses`, courses_postOneCourse);
app.get(`${mainroute}/courses`, courses_getAll);
app.put(`${mainroute}/courses/:id`, courses_editOneCourse);
app.delete(`${mainroute}/courses/:id`, courses_deleteOneCourse);
// * Modules *
app.post(`${mainroute}/moduleforcourse/:id`, courses_postOneModule);
app.get(`${mainroute}/moduleforcourse/:id`, courses_getModulesFromOneCourse);
app.put(`${mainroute}/moduleforcourse/:id`, courses_editOneModule);
app.delete(`${mainroute}/moduleforcourse/:id`, courses_deleteOneModule);
// * classes *
app.post(`${mainroute}/courseclass`, courses_postOneClass);
app.put(`${mainroute}/courseclass/:id`, courses_editOneClass);
app.get(`${mainroute}/courseclass/`, courses_getClassesFromOneModule);
app.get(`${mainroute}/courseclass/:id`, courses_getOne);
app.delete(`${mainroute}/courseclass/:id`, courses_deleteOneClass);
//
// app.delete(`${mainroute}/deleteallbut`, deleteAllBut);
//

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
app.get(`${mainroute}/blogposts`, loggedIn, blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, /*loggedIn,*/ blogPosts_getOne);
app.post(`${mainroute}/blogposts`, /*loggedIn,*/ blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, /*loggedIn,*/ blogPosts_editOne);
app.delete(`${mainroute}/blogposts/:id`, /*loggedIn,*/ blogPosts_deleteOne);

// ** TUTOTING - Aulas Particulares **
app.post(`${mainroute}/tutoring`, /*loggedIn,*/ tutoring_postOne);
app.delete(`${mainroute}/tutoring/:id`, /*loggedIn,*/ tutoring_deleteOne);
app.get(`${mainroute}/tutoring`, /*loggedIn,*/ tutoring_getAll);

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

// Talking Business
app.get(`${mainroute}/tbblogposts`, /*loggedIn,*/ tbBlogPosts_getAll);
app.get(`${mainroute}/tbblogpost/:id`, /*loggedIn,*/ tbBlogPosts_getOne);
app.post(`${mainroute}/tbblogposts`, /*loggedIn,*/ tbBlogPosts_postOne);
app.put(`${mainroute}/tbblogposts/:id`, /*loggedIn,*/ tbBlogPosts_editOne);
app.delete(`${mainroute}/tbblogposts/:id`, /*loggedIn,*/ tbBlogPosts_deleteOne);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
