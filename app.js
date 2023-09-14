const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3501;
const cors = require("cors");
const {
  students_getAll,
  students_getOne,
  student_postOne,
  student_editOne,
  student_deleteOne,
} = require("./server/controller/studentsController");
const {
  blogPosts_getAll,
  blogPosts_editOne,
} = require("./server/controller/blogPostsController");
database();
app.use(express.json());

const mainroute = "/api/v1";

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// ** STUDENTS **
app.get(`${mainroute}/students`, students_getAll);
app.get(`${mainroute}/students/:id`, students_getOne);
app.post(`${mainroute}/students`, student_postOne);
app.put(`${mainroute}/students`, student_editOne);
app.delete(`${mainroute}/students`, student_deleteOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, blogPosts_getAll);
app.get(`${mainroute}/blogposts/:id`, async (req, res) => {});
app.post(`${mainroute}/blogposts`, blogPosts_editOne);
app.put(`${mainroute}/blogposts`, async (req, res) => {});
app.delete(`${mainroute}/blogposts`, async (req, res) => {});

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
