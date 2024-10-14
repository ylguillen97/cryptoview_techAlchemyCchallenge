import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { InputForm } from "./ui/input";

import React, { useState, useEffect } from "react";
import axios from "axios";

const TradingPanel = () => {
  const [userId, setUserId] = useState("");
  const [currencyPair, setCurrencyPair] = useState("ETH/USDT");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [transactionHash, setTransactionHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    if (transactionHash && transactionStatus === "pending") {
      interval = setInterval(() => {
        checkTransactionStatus(transactionHash);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [transactionHash, transactionStatus]);

  const checkTransactionStatus = async (hash) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/transactions/status/${hash}`
      );
      setTransactionStatus(response.data.status);
      if (response.data.status === "confirmed") {
        setStatusMessage("Transaction confirmed!");
      } else if (response.data.status === "failed") {
        setStatusMessage("Transaction failed.");
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      setStatusMessage("Error checking transaction status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5001/api/trades", {
        userId,
        currencyPair,
        amount: parseFloat(amount),
        price: orderType === "limit" ? parseFloat(price) : null,
        orderType,
      });

      setTransactionHash(response.data.transactionHash);
      setStatusMessage("Transaction submitted. Awaiting confirmation...");
      setTransactionStatus("pending");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setTransactionHash("");
      setStatusMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#1B1B1B] text-white max-w-md mx-auto p-6 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Trading Panel</CardTitle>
        <CardDescription>Place your order below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID:</label>
            <InputForm
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full p-2 rounded bg-[#2D2F36] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Currency Pair:
            </label>
            <select
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              className="w-full p-2 rounded bg-[#2D2F36] text-white"
            >
              <option value="ETH/USDT">ETH/USDT</option>
              {/* Puedes añadir más pares aquí */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount:</label>
            <InputForm
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-2 rounded bg-[#2D2F36] text-white"
            />
          </div>
          {orderType === "limit" && (
            <div>
              <label className="block text-sm font-medium mb-1">Price:</label>
              <InputForm
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={orderType === "limit"}
                className="w-full p-2 rounded bg-[#2D2F36] text-white"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              Order Type:
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full p-2 rounded bg-[#2D2F36] text-white"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>
          <Button
            type="submit"
            className="w-full py-3 bg-[#311C31] hover:bg-[#432643] text-[#FC72FF] font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </Button>
        </form>
        {transactionHash && (
          <div className="mt-4 p-4 bg-[#2D2F36] rounded">
            <p>Transaction Hash: {transactionHash}</p>
          </div>
        )}
        {statusMessage && (
          <div className="mt-4 p-4 bg-[#2D2F36] rounded">
            <p>{statusMessage}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-[#2D2F36] text-red-500 rounded">
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
