const express = require("express");
const ethers = require("ethers");
const mongoose = require("mongoose");
const Trade = require("../models/tradeModel");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ETH_TESTNET_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

router.post("/", async (req, res) => {
  try {
    const { userId, currencyPair, amount, price, orderType } = req.body;

    if (!currencyPair || amount <= 0 || (orderType === "limit" && price <= 0)) {
      return res.status(400).json({ error: "Invalid order parameters" });
    }

    const tx = {
      to: process.env.RECIPIENT_ADDRESS,
      value: ethers.parseEther(amount.toString()),
      gasLimit: 21000,
    };

    const signedTx = await wallet.sendTransaction(tx);

    const newTrade = new Trade({
      userId,
      timestamp: new Date(),
      currencyPair,
      amount,
      price,
      orderType,
      transactionHash: signedTx.hash,
      status: "pending",
    });

    await newTrade.save();

    res.status(200).json({ transactionHash: signedTx.hash });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Error processing the order" });
  }
});

module.exports = router;
