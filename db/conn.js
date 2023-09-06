const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://arthurcardosocorp:lu4FZOZIo3Jwn33z@arvin.aotxd5a.mongodb.net/?retryWrites=true&w=majority",
      console.log("MONGO: Banco de dados ARVIN conectado com sucesso")
    );
  } catch (e) {
    console.log(`Erro: ${e}`);
  }
}

module.exports = main;
