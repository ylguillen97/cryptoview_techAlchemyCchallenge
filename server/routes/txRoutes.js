const express = require("express");
const {
  getTransactionsFromEtherscan,
  queryTransactions,
} = require("../controllers/txController");

const router = express.Router();

router.post("/get-ethereum-transactions", getTransactionsFromEtherscan);
router.get("/query", queryTransactions);

module.exports = router;
