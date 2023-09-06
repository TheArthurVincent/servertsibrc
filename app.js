const express = require("express");
const cors = require("cors");
const app = express();
const main = require("./db/conn");
const PORT = 3501;

app.use(cors());
app.use(express.json());

main();

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
