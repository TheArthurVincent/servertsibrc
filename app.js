const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const path = require("path");
const cors = require("cors");
const {
  loggedIn,
  loggedInADM,
  member_signUp,
  member_login,
  members_getAll,
  members_getOne,


  member_deleteOne,
  member_editGeneralData,
  member_editPassword,
  member_editPermissions,
  member_editPersonalPassword,
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
app.post(`${mainroute}/memberlogin/`, member_login);
app.get(`${mainroute}/members`,/* loggedInADM,*/ members_getAll);
app.get(`${mainroute}/member/:id`, /* loggedInADM,*/members_getOne);


// ** MEMBERS **

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
app.delete(`${mainroute}/students/:id`, loggedInADM, member_deleteOne);


















// ** COURSES **
// app.get(`${mainroute}/allgroupclasses`, loggedIn, groupClasses_getAllObjects);

// ** TUTORING - Aulas Particulares **
// app.get(`${mainroute}/tutoring`, loggedIn, tutoring_getAll);
// app.get(
//   `${mainroute}/tutoring/:studentID`,
//   loggedIn,
//   tutoring_getAllFromParticularStudent
// );
// app.get(
//   `${mainroute}/tutoringclassesofthemonth/`,
//   loggedIn,
//   tutoring_getAllFromParticularStudentInAParticularMonth
// );
// app.get(
//   `${mainroute}/tutoringmonthyear/:studentID`,
//   loggedIn,
//   tutoring_getListOfAParticularMonthOfAStudent
// );

// app.delete(`${mainroute}/tutoring/:id`, loggedInADM, tutoring_deleteOne);
// app.post(`${mainroute}/tutoring`, loggedInADM, tutoring_postOne);

// // * events *
// app.get(`${mainroute}/eventsgeneral/:id`, loggedIn, events_seeAll);
// app.get(`${mainroute}/eventseenextttoring/:id`, loggedIn, events_seeNext);
// app.post(`${mainroute}/event`, event_New);
// app.post(`${mainroute}/tutoringevent`, event_NewTutoring);
// app.delete(`${mainroute}/tutoringevent`, event_DeleteTutoring);
// app.put(`${mainroute}/event/:id`, events_editOne);
// app.put(`${mainroute}/eventstatus/:id`, events_editOneStatus);
// app.delete(`${mainroute}/event/:id`, events_deleteOne);
// app.post(`${mainroute}/eventreminder/:id`, event_reminderEvent);

// app.get(`${mainroute}/event/:id`, events_seeOne);
// app.get(
//   `${mainroute}/tutoringsevents/:studentId`,
//   events_seeAllTutoringsFromOneStudent
// );
// app.put(`${mainroute}/tutoringevent`, events_editOneTutoring);

// * Homework *
// app.get(`${mainroute}/homework/:id`, loggedIn, homework_getAll);
// app.put(`${mainroute}/homework/:id`, homework_done);

// * Courses Management *
// app.post(`${mainroute}/courseclasses`, courseClasses_postMultipleClasses);
// app.post(`${mainroute}/course`, courseClasses_postNewCourse);
// app.post(`${mainroute}/module`, courseClasses_postNewModule)

// app.get(`${mainroute}/courses/:studentId`, courseClasses_getAll);
// app.get(`${mainroute}/course/:id`, courseClasses_getOne);

// * group classes *
// app.post(`${mainroute}/groupclass`, loggedInADM, groupClasses_postOneClass);
// app.put(`${mainroute}/groupclass/:id`, loggedInADM, groupClasses_editOneClass);
// app.get(
//   `${mainroute}/groupclass/`,
//   loggedIn,
//   groupClasses_getClassesFromOneModule
// );
// app.get(`${mainroute}/groupclass/:id`, loggedIn, groupClasses_getOne);
// app.delete(
//   `${mainroute}/groupclass/:id`,
//   loggedInADM,
//   groupClasses_deleteOneClass
// );

// ** NEXT CLASSES **
// app.get(`${mainroute}/nexttutoring`, loggedIn, nextTutoring_seeAllTutorings);
// app.post(`${mainroute}/nexttutoring`, loggedInADM, nextTutoring_editNext);
// app.get(`${mainroute}/nexttutoring/:id`, loggedIn, tutoring_getNext);

// **Material**
// app.post(`${mainroute}/material`, loggedInADM, material_postNew);
// app.delete(`${mainroute}/material/:id`, loggedInADM, material_deleteOne);
// app.put(`${mainroute}/material/:id`, loggedInADM, material_editOne);
// app.get(`${mainroute}/material/`, loggedIn, material_getAll);
// app.get(`${mainroute}/material/:id`, loggedIn, material_getOne);

// **BLOG POSTS**
// app.get(`${mainroute}/blogposts`, loggedIn, blogPosts_getAll);
// app.get(`${mainroute}/blogpost/:id`, loggedIn, blogPosts_getOne);
// app.post(`${mainroute}/blogposts`, loggedInADM, blogPosts_postOne);
// app.put(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_editOne);
// app.delete(`${mainroute}/blogposts/:id`, loggedInADM, blogPosts_deleteOne);

// Live Classes
// app.post(`${mainroute}/liveclass`, nextLiveClass_postNext);
// app.get(`${mainroute}/liveclasses`, loggedIn, nextLiveClass_getNext);
// app.get(`${mainroute}/sendnotificationemail`, event_reminderEventAutomatic);


// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
