const { Student_Model } = require("../models/Students");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Black_List } = require("../models/BlackList");

const students_getAll = async (req, res) => {
  try {
    const students = await Student_Model.find();
    const formattedStudentsData = students.map((student, index) => {
      return {
        position: index,
        id: student._id,
        username: student.username,
        email: student.email,
        name: student.name,
        lastname: student.lastname,
        password: student.password,
        dateOfBirth: student.dateOfBirth,
        fullname: student.name + " " + student.lastname,
        permissions: student.permissions,
        doc: student.doc,
        phoneNumber: student.phoneNumber,
      };
    });
    formattedStudentsData.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0; // Nomes são iguais
    });

    res.status(200).json({
      status: `Sucesso! Foram encontrados ${students.length - 1} alunos.`,
      listOfStudents: formattedStudentsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Nenhum aluno");
  }
};

const students_getOne = async (req, res) => {
  try {
    const student = await Student_Model.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const formattedStudentData = {
      id: student._id,
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

  const hashedPassword = bcrypt.hashSync(password, 10);

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
      name,
      password: hashedPassword,
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

const student_login = async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || (!email && !username))
    return res.status(400).json("Dados faltantes");

  try {
    const student = await Student_Model.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!student) throw new Error("Usuário não encontrado");

    if (!(await bcrypt.compare(password, student.password)))
      throw new Error("Senha incorreta");

    const token = jwt.sign({ id: student._id }, "process.env.SECRET", {
      expiresIn: "15d",
    });
    const data = {
      name: student.name,
      username: student.username,
      id: student._id,
      token: token,
    };

    res.status(200).json({ token, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocorreu um erro ao fazer login" });
  }
};

async function auth_loggedIn(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const blacklistedToken = await Black_List.findOne({ token });

  if (blacklistedToken) {
    return res.status(401).json({ message: "Token na lista negra" });
  }

  try {
    jwt.verify(token, "process.env.SECRET");
    next();
  } catch (error) {
    res.status(400).json({ error: "Acesso negado" });
  }
}

async function logout(req, res) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    // Crie um documento Black_List com o token inválido
    await Black_List.create({ token });
    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar o token à lista negra" });
  }
}

const student_editGeneralData = async (req, res) => {
  const { username, email, name, lastname, phoneNumber } = req.body;
  try {
    const { id } = req.params;
    const studentToEdit = await Student_Model.findById(id);
    if (!studentToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!username || !email || !name || !lastname || !phoneNumber) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (
      studentToEdit.name === name &&
      studentToEdit.lastname === lastname &&
      studentToEdit.username === username &&
      studentToEdit.email === email &&
      studentToEdit.phoneNumber === phoneNumber
    ) {
      res.json({
        message: `Nenhuma edição feita no usuário ${studentToEdit.username}`,
      });
    } else {
      studentToEdit.name = name;
      studentToEdit.lastname = lastname;
      studentToEdit.username = username;
      studentToEdit.email = email;
      studentToEdit.phoneNumber = phoneNumber;

      await studentToEdit.save();
      console.log(studentToEdit);

      res.status(200).json({
        message: "Aluno editado com sucesso",
        updatedUser: studentToEdit,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPassword = async (req, res) => {
  const { password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const { id } = req.params;
    const studentWhosePasswordYouWantToChange = await Student_Model.findById(
      id
    );

    if (!studentWhosePasswordYouWantToChange) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!hashedPassword) {
      return res.status(400).json({ message: "Escolha uma nova senha" });
    } else if (
      studentWhosePasswordYouWantToChange.password === hashedPassword
    ) {
      res.json({
        message: `Escolha uma senha diferente para ${studentWhosePasswordYouWantToChange.username}`,
      });
    } else {
      studentWhosePasswordYouWantToChange.password = hashedPassword;
      await studentWhosePasswordYouWantToChange.save();

      res.status(200).json({
        message: "Senha edtada com sucesso",
        updatedUser: studentWhosePasswordYouWantToChange,
      });
      console.error(studentWhosePasswordYouWantToChange);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const { id } = req.params;
    const studentWhosePermissionsToEdit = await Student_Model.findById(id);
    if (!studentWhosePermissionsToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!permissions) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (studentWhosePermissionsToEdit.permissions === permissions) {
      res.json({
        message: `Nenhuma edição de permissões feita no usuário ${studentWhosePermissionsToEdit.username}`,
      });
    } else {
      studentWhosePermissionsToEdit.permissions = permissions;

      await studentWhosePermissionsToEdit.save();

      res.status(200).json({
        message: "Permissões do aluno editadas com sucesso",
        updatedUser: studentWhosePermissionsToEdit,
      });
      console.error(studentWhosePermissionsToEdit);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar permissões do aluno");
  }
};

const student_deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student_Model.findById(id);

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
  //C
  student_postOne,
  auth_loggedIn,
  logout,
  //R
  students_getAll,
  students_getOne,
  student_login,
  //U
  student_editGeneralData,
  student_editPassword,
  student_editPermissions,
  //D
  student_deleteOne,
};
