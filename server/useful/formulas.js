const { Student_Model } = require("../models/Students");

const formatDate = (dataString) => {
  const data = new Date(dataString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  const diaFormatado = dia < 10 ? `0${dia}` : dia;
  const mesFormatado = mes < 10 ? `0${mes}` : mes;
  return `${diaFormatado}/${mesFormatado}/${ano}`;
}

const getStudent = async (id) => { await Student_Model.findById(id) };

module.exports = { formatDate, getStudent };
