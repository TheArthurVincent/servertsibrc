const nodemailer = require("nodemailer");

const emailConfig = {
  email: "arthurcardosocorp@gmail.com",
  password: "Tui2209Vini1305#@#@",
};

// Configuração do transporte
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.email,
    pass: emailConfig.password,
  },
});

// Função para enviar e-mail
const sendEmail = (to, subject, text) => {
  // Configuração do e-mail
  const mailOptions = {
    from: emailConfig.email,
    to: to,
    subject: subject,
    text: text,
  };

  // Envio do e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("E-mail enviado: " + info.response);
    }
  });
};

module.exports = sendEmail;
