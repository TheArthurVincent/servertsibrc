const Student_Model = require("../models/Students");
//importe o arquivo sendpulse.js
const mailSend = require("../useful/sendpulse");

//crie uma instancia da classe mailSend
const mail = new mailSend();

const signup = async (req, res, next) => {
  const newUser = await Student_Model.create(req.body);

  const { email, name } = req.body;

  await mail.sendMail(
    email,
    name,
    "Bem vindo ao Arvin",
    "<h1>Seja bem vindo!</h1>"
  );
  await mail.sendMail(
    "arthurcardosocorp@gmail.com",
    name,
    "Bem vindo ao Arvin",
    "<h1>Seja bem vindo!</h1>"
  );

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
