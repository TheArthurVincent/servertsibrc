const sendpulse = require("sendpulse-api");

let API_USER_ID, API_SECRET, TOKEN_STORAGE;

//aqui deve subistituir com suas credenciais
API_USER_ID = "b8faa40b161548cf666b5a2a275cb78b";
API_SECRET = "cb960b298d6730d324f168455fe58fce";
//essa sera uma pasta temporaria para armazenar o token
TOKEN_STORAGE = "/tmp/";

class mailSend {

  //função para pegar a resposta do servidor de email
  async answerGetter(data) {
    console.log(data);
  }

  //função para enviar o email
  async sendMail(tomail, name, subject, body) {

    let answerGetter = this.answerGetter;

    //aqui é o corpo do email
    let emailData = {
      html: body,
      subject: subject,
      from: {
        name: "Arthur Vincent - Arvin English School", //aqui é o nome que vai aparecer no email
        email: "contato@digitalmoontech.com.br" //aqui é o email que vai aparecer no email (deve ser o mesmo configurado como remetente*)
      },
      to: [
        {
          name: name,
          email: tomail
        }
      ]
    }

    return sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
      console.log(token);

      sendpulse.smtpSendMail(answerGetter, emailData);
    });



  }

  //função para enviar o sms (ainda não testado)
  async sendSMS(phone, text) {

    let answerGetter = this.answerGetter;

    return sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
      console.log(token);

      sendpulse.smsSend(answerGetter, "Digitalmoon", [phone], text);
    });

  }
}

module.exports = mailSend;