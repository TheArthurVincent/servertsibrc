const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db/conn");
const PORT = 3501;

app.use(cors());
app.use(express.json());

connection();

const routes = require("./server/routes/router");

app.use("/app", routes);

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
