const Student_Model = require("../models/Students");
//importe o arquivo sendpulse.js
const mailSend = require("../useful/sendpulse");

//crie uma instancia da classe mailSend
const mail = new mailSend();

const signup = async (req, res, next) => {
  const newUser = await Student_Model.create(req.body);

  const { email, name } = req.body;

  //aqui é onde envia o email, o corpo do email deve ser uma string de html (ou um ejs carregado)
  await mail.sendMail(email, name, "Bem vindo ao Arvin", "<h1>Seja bem vindo!</h1>");

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

module.exports = {
  signup,
};
