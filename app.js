const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db/conn");
const PORT = 3501;

let isDev = true;
// isDev = false;
const front = isDev ? "http://localhost:5173" : "";

app.use(
  cors({
    origin: front,
    credentials: true,
  })
);
app.use(express.json());

connection();

const routes = require("./server/routes/router");

app.use("/app", routes);

app.listen(PORT, function () {
  console.log(`Servidor rodando na porta ${PORT}`);
});
