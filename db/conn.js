const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://arthurcardosocorp:lu4FZOZIo3Jwn33z@arvin.aotxd5a.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000, // 30 segundos
        socketTimeoutMS: 30000, // 30 segundos
      }
    );

    console.log("MONGO: Banco de dados ARVIN conectado com sucesso");
  } catch (e) {
    console.error(`Erro na conexão com o MongoDB: ${e}`);
  }
}

module.exports = main;
