const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const cors = require("cors");
const {
  students_getAll,
  students_getOne,
  student_postOne,
  student_editOne,
  student_deleteOne,
  student_login,
} = require("./server/controller/studentsController");
const {
  blogPosts_getAll,
  blogPosts_editOne,
  blogPosts_getSpecific,
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

// ** STUDENTS **
app.get(`${mainroute}/students`, students_getAll);
app.get(`${mainroute}/student/:id`, students_getOne);
app.post(`${mainroute}/students`, student_postOne);
app.put(`${mainroute}/students/:id`, student_editOne);
app.delete(`${mainroute}/students/:id`, student_deleteOne);

app.post(`${mainroute}/students/:id`, student_login);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, blogPosts_getAll);
app.get(`${mainroute}/filteredblogposts/`, blogPosts_getSpecific);
app.post(`${mainroute}/blogposts`, blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, blogPosts_editOne);
app.delete(`${mainroute}/blogposts/`, blogPosts_deleteOne);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
