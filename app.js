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
  signup,
  logout,
  loggedIn,
} = require("./server/controller/studentsController");
const {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getOne,
  blogPosts_postOne,
  blogPosts_deleteOne,
} = require("./server/controller/blogPostsController");

database();
app.use(express.json());

const mainroute = "/api/v1";

app.use(
  cors({
    origin: "*",
  })
);

// Auth
app.post(`${mainroute}/signup`, signup);

// ** STUDENTS **
app.post(`${mainroute}/students`, student_postOne);

app.post(`${mainroute}/studentlogin/`, student_login);
app.get(`${mainroute}/students`, loggedIn, students_getAll);
app.get(`${mainroute}/student/:id`, students_getOne);

app.put(`${mainroute}/students/:id`, student_editGeneralData);
app.put(`${mainroute}/studentpassword/:id`, student_editPassword);
app.put(`${mainroute}/studentpermissions/:id`, student_editPermissions);

app.delete(`${mainroute}/students/:id`, student_deleteOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, blogPosts_getOne);
app.post(`${mainroute}/blogposts`, blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, blogPosts_editOne);
app.delete(`${mainroute}/blogposts/:id`, blogPosts_deleteOne);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
