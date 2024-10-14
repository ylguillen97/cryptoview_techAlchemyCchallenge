const axios = require("axios");
const Transaction = require("../models/txModel");

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const getTransactionsFromEtherscan = async (req, res) => {
  const { address } = req.body;

  try {
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: "account",
        action: "txlist",
        address,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
        offset: 5,
        page: 1,
      },
    });

    if (response.data.status !== "1") {
      return res.status(400).json({ error: "Failed to retrieve transactions" });
    }

    const transactions = response.data.result.slice(0, 5).map((tx) => ({
      address,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timestamp: new Date(tx.timeStamp * 1000),
    }));

    await Transaction.insertMany(transactions, { ordered: false })
      .then((result) => {
        res
          .status(200)
          .json({ insertedCount: result.length, transactions: result });
      })
      .catch((error) => {
        if (error.code === 11000) {
          console.warn(
            "Duplicate transaction(s) detected, inserted only new records."
          );
          res.status(200).json({
            message: "Duplicate transactions ignored, inserted unique records.",
          });
        } else {
          console.error("Error inserting transactions:", error);
          res.status(500).json({ error: "Failed to insert transactions." });
        }
      });
  } catch (error) {
    console.error("Error retrieving transactions from Etherscan:", error);
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
};

const queryTransactions = async (req, res) => {
  const { address, startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.find({
      address,
      timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error querying transactions:", error);
    res.status(500).json({ error: "Failed to query transactions" });
  }
};

module.exports = { getTransactionsFromEtherscan, queryTransactions };
