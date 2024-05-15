const sendpulse = require('sendpulse-api');

// Substitua pelos valores das suas credenciais do SendPulse
const API_USER_ID = 'seu_api_user_id';
const API_SECRET = 'seu_api_secret';
const TOKEN_STORAGE = '/tmp/';

// Inicializa a API do SendPulse
sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
  console.log('SendPulse token:', token);
});

// Função para enviar um email
function sendEmail() {
  const email = {
    html: "<h1>Olá!</h1><p>Este é um email de teste.</p>",
    text: "Este é um email de teste.",
    subject: "Testando SendPulse",
    from: {
      name: "Seu Nome",
      email: "seu_email@dominio.com"
    },
    to: [
      {
        name: "Nome do Destinatário",
        email: "destinatario@dominio.com"
      }
    ]
  };

  sendpulse.smtpSendMail((response) => {
    console.log(response);
  }, email);
}

// Chama a função para enviar o email
sendEmail();
