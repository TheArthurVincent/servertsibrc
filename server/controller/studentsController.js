const { Student_Model } = require("../models/Students");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const { NextTutoring_Model } = require("../models/NextEvents");
const { Picture_Model } = require("../models/Pictures");
const path = require("path");
const fs = require("fs")

const students_postPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student_Model.findById(id);
    const { name, username, lastname } = student
    const file = req.file
    const pic = new Picture_Model({
      name: `Profile Photo: ${username} ${name} ${lastname}`,
      src: file.path,
      studentID: id,
    })
    await pic.save()
    res.status(200).json({
      status: `Sucesso!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar a imagem.' });
  }
};

const student_getPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const pic = await Picture_Model.findOne({ studentID: id });
    const student = await Student_Model.findById(id);

    if (!pic) {
      return res.status(200).json({
        status: `Sucesso!`,
        pic: student.picture,
      });
    } else {
      res.sendFile(path.resolve(pic.src))
    }
    console.log(pic)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar a imagem.' });
  }
}


const students_getAllScores = async (req, res) => {
  try {
    const students = await Student_Model.find();

    const filteredStudents = students.filter(student => student._id.toString() !== "651311fac3d58753aa9281c5");

    const formattedStudentsData = filteredStudents.map((student, index) => {
      return {
        username: student.username,
        name: student.name,
        lastname: student.lastname,
        picture: student.picture,
        monthlyScore: student.monthlyScore,
        totalScore: student.totalScore,
      };
    });

    formattedStudentsData.sort((a, b) => b.totalScore - a.totalScore);
    res.status(200).json({
      listOfStudents: formattedStudentsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno / Erro no servidor", error });
  }
};



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
        ankiEmail: student.ankiEmail,
        ankiPassword: student.ankiPassword,
        googleDriveLink: student.googleDriveLink,
        picture: student.picture,
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
      return 0;
    });

    res.status(200).json({
      status: `Sucesso! Foram encontrados ${students.length} alunos.`,
      listOfStudents: formattedStudentsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno / Erro no servidor", error });
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
      picture: student.picture,
      monthlyScore: student.monthlyScore,
      totalScore: student.totalScore,
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
    ankiEmail,
    ankiPassword,
    googleDriveLink,
    date,
    time,
    link,
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
      ankiEmail,
      ankiPassword,
      googleDriveLink,
      nextClass: { date, time, link },
    });

    await newStudent.save();

    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
      username,
    });
  } catch (error) {
    res.status(500).json({ Erro: "Aluno não registrado", error });
  }
};

const signup = async (req, res) => {
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
      password: hashedPassword,
      name,
      lastname,
      doc,
      phoneNumber,
      dateOfBirth,
    });

    const token = jwt.sign({ id: newStudent._id }, "secretToken()", {
      expiresIn: "15d",
    });

    await newStudent.save();

    res.status(201).json({
      status: "Aluno registrado, logando no sistema",
      data: { newStudent },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aluno não cadastrado", error: error });
  }
};

const student_login = async (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json("Digite sua senha");
  } else if (!email) {
    return res.status(400).json("Digite seu e-mail");
  }
  try {
    const student = await Student_Model.findOne({ email: email });

    if (!student) throw new Error("Usuário não encontrado");

    if (!(await bcrypt.compare(password, student.password)))
      throw new Error("Senha incorreta");

    const token = jwt.sign({ id: student._id }, "secretToken()", {
      expiresIn: "30d",
    });

    student.changedPasswordBeforeLogInAgain = false;
    const nextTutoring = await NextTutoring_Model.findOne({
      studentID: student._id,
    });

    const loggedIn = {
      id: student._id,
      username: student.username,
      email: student.email,
      name: student.name,
      lastname: student.lastname,
      doc: student.doc,
      totalScore: student.totalScore,
      monthlyScore: student.monthlyScore,
      phoneNumber: student.phoneNumber,
      dateOfBirth: student.dateOfBirth,
      permissions: student.permissions,
      picture: student.picture,
      ankiEmail: student.ankiEmail,
      ankiPassword: student.ankiPassword,
      googleDriveLink: student.googleDriveLink,
    };

    res
      .status(200)
      .json({ token: token, loggedIn: loggedIn, nextTutoring: nextTutoring });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao fazer login" });
  }
};

const student_seeScore = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    const { totalScore, monthlyScore } = student;
    res
      .status(200)
      .json({ totalScore, monthlyScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao ver a pontuação" });
  }
};

const student_scoreUpdate = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  theScore = new Number(score)

  try {
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    newTotalScore = student.totalScore + theScore;
    newMonthlyScore = student.monthlyScore + theScore;

    student.totalScore = newTotalScore;
    student.monthlyScore = newMonthlyScore;

    student.save()

    res
      .status(200)
      .json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};
const student_resetMonth = async (req, res) => {

  try {
    const students = await Student_Model.find();
    const master = await Student_Model.findById("651311fac3d58753aa9281c5");

    students.map((student) => {
      student.monthlyScore = 0
      // student.totalScore = 0 // resetall
      student.save()
    })

    master.totalScore = 2000000
    master.save();
    res
      .status(200)
      .json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};

const loggedIn = async (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ erro: "NENHUM USUÁRIO LOGADO" });
  }
  let freshUser;
  try {
    let decoded = await promisify(jwt.verify)(authorization, "secretToken()");
    if (decoded) {
      freshUser = await Student_Model.findById(decoded.id);
    } else {
      console.log("erro, não já decoded nem freshUser");
    }
    if (!freshUser) {
      return res.status(500).json({
        error: "Este usuário já não existe mais",
      });
    } else if (freshUser.changedPasswordBeforeLogInAgain) {
      return res.status(500).json({
        error: "Você recentemente mudou sua senha. Faça login novamente",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      error:
        "Você não está logado de maneira válida, portanto não pode executar esta rota",
    });
  }
};

const loggedInADM = async (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ erro: "NENHUM USUÁRIO LOGADO" });
  }
  let freshUser;
  try {
    let decoded = await promisify(jwt.verify)(authorization, "secretToken()");
    if (decoded) {
      freshUser = await Student_Model.findById(decoded.id);
    } else {
      console.log("erro, não já decoded nem freshUser");
    }
    if (!freshUser) {
      return res.status(500).json({
        error: "Este usuário já não existe mais",
      });
    } else if (freshUser.permissions !== "superadmin") {
      return res.status(500).json({
        error: "Você não é administrador!!",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      error:
        "Você não está logado de maneira válida, portanto não pode executar esta rota",
    });
  }
};

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

      res.status(200).json({
        message: "Aluno editado com sucesso",
        updatedUser: studentToEdit,
      });
    }
  } catch (error) {
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

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

const student_editNextClass = async (req, res) => {
  const { date, time, link } = req.body;
  const { id } = req.params;

  try {
    const studentWhoseClassYouWantToChange = await Student_Model.findById(id);

    if (!studentWhoseClassYouWantToChange) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else {
      studentWhoseClassYouWantToChange.nextClass.date = date;
      studentWhoseClassYouWantToChange.nextClass.time = time;
      studentWhoseClassYouWantToChange.nextClass.link = link;

      await studentWhoseClassYouWantToChange.save();

      res.status(200).json({
        message: "Aula salva com sucesso",
        updatedUser: studentWhoseClassYouWantToChange,
      });
      console.error(studentWhoseClassYouWantToChange);
    }
  } catch (error) {
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
    res.status(500).json({ erro: "Falha ao excluir aluno!", status: error });
  }
};

module.exports = {
  // Security
  loggedIn,
  loggedInADM,
  //C
  student_postOne,
  signup,
  students_postPicture,
  student_getPicture,
  //R
  students_getAll,
  students_getAllScores,
  students_getOne,
  student_login,
  student_scoreUpdate,
  student_seeScore,
  student_resetMonth,
  //U
  student_editGeneralData,
  student_editPassword,
  student_editPermissions,
  //D
  student_deleteOne,
};
