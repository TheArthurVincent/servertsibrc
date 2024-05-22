const sendpulse = require("sendpulse-api");

const API_USER_ID = "30c7d52e21fce403e9fc12506a0f0978";
const API_SECRET = "bbc35d9aab689ddbee8541250880504b";
const TOKEN_STORAGE = "/tmp/";

sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
  if (token) {
    console.log("SendPulse token o ar!");
  } else {
    console.error("Falha ao inicializar o SendPulse. Verifique suas credenciais.");
  }
});

// Função para enviar um email
function sendEmail(
  htmlMessage,
  text,
  subject,
  nameTo,
  emailTo
) {
  const email = {
    html: htmlMessage,
    text: text,
    subject: subject,
    from: {
      name: "Arthur Vincent",
      email: "contato@arthurvincent.com.br",
    },
    to: [
      {
        name: nameTo,
        email: emailTo,
      },
    ],
  };

  return new Promise( (resolve, reject) => {
    
    sendpulse.smtpSendMail((response) => {
      if (response.result) {
        console.log("Email enviado com sucesso:", response);
        resolve(true);
      } else {
        console.error("Erro ao enviar email:", response);
        reject(response);
      }
    }, email);

  })
}

module.exports = { sendEmail };
