const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  hash: { type: String, unique: true, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
