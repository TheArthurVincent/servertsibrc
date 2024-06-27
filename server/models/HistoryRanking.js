const mongoose = require("mongoose");
const { Schema } = mongoose;

const historyRankingModel = new Schema({
  score: { type: Array, required: true },
});

const HistoryRanking_Model = mongoose.model("HistoryRanking", historyRankingModel);

module.exports = {
  HistoryRanking_Model,
};
