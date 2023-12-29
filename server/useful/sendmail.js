const nodemailer = require("nodemailer");
const ejs = require("ejs");

const emailConfig = {
  email: "arvinenglishschool@gmail.com",
  password: "pbjy jfog mqyg srlm",
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: emailConfig.email,
    pass: emailConfig.password,
  },
  secure: true,
  connectionTimeout: 20000, // 20 seconds
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
          console.log(`E-mails de aula marcada não enviados ${new Date()}`);
          resolve(htmlContent);
        }
      }
    );
  });
};

const renderEmailTemplatePostedClass = async (
  studentName,
  classDate,
  classTitle
) => {
  return new Promise((resolve, reject) => {
    const templatePath = "server/useful/emailtemplates/newtutoringposted.ejs";
    ejs.renderFile(
      templatePath,
      { studentName, classDate, classTitle },
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
  renderEmailTemplatePostedClass,
};
