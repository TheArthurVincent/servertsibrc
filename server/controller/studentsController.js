const { Student_Model } = require("../models/Students");

const students_getAll = async (req, res) => {
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
      students: students,
      numberOfStudents: students.length,
      listOfStudents: formattedStudentsData,
    });
    console.log(students);
  } catch (error) {
    console.error(error);
    res.status(500).send("Nenhum aluno");
  }
};

const students_getOne = async (req, res) => {
  try {
    const student = await Student_Model.findById(req.params.id);
    console.log(req.body);

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const formattedStudentData = {
      username: student.username,
      sub: student._id,
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
};

const student_postOne = async (req, res) => {
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
};

const student_editOne = async (req, res) => {
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

    const existingStudent = await Student_Model.findOne({ username: username });

    if (!existingStudent) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

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
};

const student_deleteOne = async (req, res) => {
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
};
module.exports = {
  students_getAll,
  students_getOne,
  student_postOne,
  student_editOne,
  student_deleteOne,
};
