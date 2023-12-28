const nodemailer = require("nodemailer");
const ejs = require("ejs");

const emailConfig = {
  email: "arvinenglishschool@gmail.com",
  password: "pbjy jfog mqyg srlm",
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.email,
    pass: emailConfig.password,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: emailConfig.email,
    to: to,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("E-mail enviado: " + info.response);
    }
  });
};

const renderEmailTemplateScheduledClass = async (
  studentName,
  classDate,
  classTime,
  meetingUrl
) => {
  return new Promise((resolve, reject) => {
    const templatePath = "server/useful/emailtemplates/scheduledclass.ejs";
    ejs.renderFile(
      templatePath,
      { studentName, classDate, classTime, meetingUrl },
      (err, htmlContent) => {
        if (err) {
          console.error("Erro ao renderizar o template EJS:", err);
          reject(err);
        } else {
          resolve(htmlContent);
        }
      }
    );
  });
};

module.exports = {
  sendEmail,
  renderEmailTemplateScheduledClass,
};
