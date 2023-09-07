const { Student_Model } = require("../models/Students");

const studentController = {
  create: async (req, res) => {
    try {
      const newStudent = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        lastname: req.body.lastname,
        doc: req.body.doc,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
      };

      const student = await Student_Model.findOne({
        $or: [
          { username: newStudent.username },
          { email: newStudent.email },
          { doc: newStudent.doc },
        ],
      });
      if (student) {
        if (student.username === newStudent.username) {
          res
            .status(400)
            .json({ msg: "Já existe um usuário com este username" });
        } else if (student.email === newStudent.email) {
          res.status(400).json({ msg: "Já existe um usuário com este email" });
        } else if (student.doc === newStudent.doc) {
          res.status(400).json({ msg: "Já existe um usuário com este CPF" });
        }
      } else {
        console.log(newStudent);
        const response = await Student_Model.create(newStudent);
        res.status(201).json({ response, msg: "Aluno cadastrado com sucesso" });
      }
    } catch (error) {
      console.log("Erro: " + error);
      res.status(500).json({ msg: "Erro ao cadastrar" });
    }
  },
  find: async (req, res) => {
    try {
      const { name, email, username } = req.body;
      const query = {};

      if (name) {
        query.name = name;
      }

      if (email) {
        query.email = email;
      }

      if (username) {
        query.username = username;
      }

      const students = await Student_Model.find(query);
      res.json(students);
    } catch (error) {
      console.log(error);
      res.json({ msg: "Nenhum aluno encontrado" });
    }
  },
  update: async (req, res) => {
    try {
      const { username, email } = req.body;
      if (!username && !email) {
        return res.status(400).json({ msg: "Escolha um usuário para editar" });
      }
      const query = username ? { username } : { email };
      const user = await Student_Model.findOne(query);
      if (!user) {
        return res.status(400).json({ msg: "Usuário não encontrado" });
      }
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      if (req.body.doc) {
        user.doc = req.body.doc;
      }
      if (req.body.dateOfBirth) {
        user.dateOfBirth = req.body.dateOfBirth;
      }
      if (req.body.phoneNumber) {
        user.phoneNumber = req.body.phoneNumber;
      }
      await user.save();
      res.status(200).json({ msg: "Usuário salvo" });
    } catch (error) {
      console.log(error);
      res.json({ msg: "Erro ao atualizar" });
    }
  },
  delete: async (req, res) => {
    try {
      const { username, email } = req.body;

      if (!username && !email) {
        return res.status(400).json({ msg: "Escolha um usuário para excluir" });
      }

      const query = username ? { username } : { email };
      const user = await Student_Model.findOne(query);

      if (!user) {
        return res.status(400).json({ msg: "Usuário não encontrado" });
      }
      console.log("Aquii" + user);
      await user.deleteOne();
      res.status(200).json({ msg: "Usuário excluído com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao excluir usuário" });
    }
  },
};

module.exports = studentController;
