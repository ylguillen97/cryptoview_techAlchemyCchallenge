const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  currencyPair: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: false,
  },
  orderType: {
    type: String,
    required: true,
    enum: ["market", "limit"],
  },
  transactionHash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "failed"],
    default: "pending",
  },
});

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
