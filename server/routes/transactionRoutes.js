const express = require("express");
const {
  getTransactions,
  queryTransactions,
} = require("../controllers/transactionController");
const router = express.Router();

router.post("/get", getTransactions);
router.get("/query", queryTransactions);

module.exports = router;
