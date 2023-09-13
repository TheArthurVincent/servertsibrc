const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3501;
const cors = require("cors");
const { Student_Model } = require("./server/models/Students");
database();
app.use(express.json());

const mainroute = "/api/v1";

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// Ver todos os alunos
app.get(`${mainroute}/students`, async (req, res) => {
  try {
    const students = await Student_Model.find();
    const formattedStudentsData = students.map((student, index) => {
      return {
        position: index,
        sub: student._id,
        username: student.username,
        email: student.email,
        name: student.name,
        lastname: student.lastname,
        fullname: student.name + " " + student.lastname,
        permissions: student.permissions,
        doc: student.doc,
        phoneNumber: student.phoneNumber,
      };
    });
    res.status(200).json({
      status: "Alunos encontrados",
      numberOfStudents: students.length,
      listOfStudents: formattedStudentsData,
    });
    console.log(students);
  } catch (error) {
    console.error(error);
    res.status(500).send("Nenhum aluno");
  }
});

// Ver um aluno
app.get(`${mainroute}/students/:id`, async (req, res) => {
  try {
    const student = await Student_Model.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const formattedStudentData = {
      username: student.username,
      email: student.email,
      name: student.name,
      lastname: student.lastname,
      fullname: student.name + " " + student.lastname,
      permissions: student.permissions,
      doc: student.doc,
      phoneNumber: student.phoneNumber,
    };
    res.status(200).json({
      status: "Aluno encontrado",
      formattedStudentData,
    });
    console.log(formattedStudentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno encontrado!", status: error });
  }
});

// Postar novo aluno
app.post(`${mainroute}/students`, async (req, res) => {
  const {
    username,
    email,
    password,
    name,
    lastname,
    doc,
    phoneNumber,
    dateOfBirth,
  } = req.body;

  try {
    const existingStudent = await Student_Model.findOne({
      $or: [{ email: email }, { doc: doc }, { username: username }],
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email, doc ou username já estão em uso" });
    }

    const newStudent = new Student_Model({
      username,
      email,
      password,
      name,
      lastname,
      doc,
      phoneNumber,
      dateOfBirth,
    });

    await newStudent.save();

    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
      username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Aluno não cadastrado");
  }
});

// Editar um aluno
app.put(`${mainroute}/students`, async (req, res) => {
  const {
    username,
    email,
    password,
    name,
    lastname,
    doc,
    phoneNumber,
    dateOfBirth,
  } = req.body;

  try {
    // Verifique se os campos obrigatórios estão presentes
    if (
      !username ||
      !email ||
      !password ||
      !name ||
      !lastname ||
      !doc ||
      !phoneNumber ||
      !dateOfBirth
    ) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    // Verifique se o aluno com o username fornecido existe
    const existingStudent = await Student_Model.findOne({ username: username });

    if (!existingStudent) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Atualize os campos do aluno com os valores fornecidos na solicitação

    if (
      existingStudent.email === email &&
      existingStudent.password === password &&
      existingStudent.name === name &&
      existingStudent.lastname === lastname &&
      existingStudent.doc === doc &&
      existingStudent.phoneNumber === phoneNumber &&
      existingStudent.dateOfBirth === dateOfBirth
    ) {
      res.json({
        message: `Nenhuma edição feita no usuário ${existingStudent.username}`,
      });
    } else {
      existingStudent.email = email;
      existingStudent.password = password;
      existingStudent.name = name;
      existingStudent.lastname = lastname;
      existingStudent.doc = doc;
      existingStudent.phoneNumber = phoneNumber;
      existingStudent.dateOfBirth = dateOfBirth;

      // Salve as atualizações no banco de dados
      await existingStudent.save();

      res.status(200).json({
        message: "Aluno editado com sucesso",
        updatedUser: existingStudent,
      });
      console.error(existingStudent);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
});

app.delete(`${mainroute}/students`, async (req, res) => {
  try {
    const { username } = req.body;
    const student = await Student_Model.findOne({ username: username });

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else {
      await student.deleteOne();
      res.status(200).json({
        status: "Aluno excluído com sucesso",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Falha ao excluir aluno!", status: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
