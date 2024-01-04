const nodemailer = require("nodemailer");
const ejs = require("ejs");

const emailConfig = {
  email: "arvinenglishschool@gmail.com",
  password: "bdiv cvpc kvrm gnsd",
};
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: emailConfig.email,
    pass: emailConfig.password,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: emailConfig.email,
    to: [to, "arthurcardosocorp@gmail.com"],
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      console.log(`E-mail NÃO enviado ${new Date()}, ${error}`);
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
