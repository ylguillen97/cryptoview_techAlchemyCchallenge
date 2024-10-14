import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { InputForm } from "@/components/ui/input";

const AuthenticationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setStatusMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const endpoint = isLogin
      ? "http://localhost:5001/api/users/signin"
      : "http://localhost:5001/api/users/signup";
    try {
      const response = await axios.post(endpoint, { email, password });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setStatusMessage("Authentication successful!");
      }
    } catch (error) {
      setStatusMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <Card className="bg-[#1B1B1B] text-white max-w-md mx-auto p-6 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {isLogin ? "Please log in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <InputForm
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#2D2F36] text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <InputForm
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#2D2F36] text-white"
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 bg-[#311C31] hover:bg-[#432643] text-[#FC72FF] font-bold"
        >
          {isLogin ? "Login" : "Register"}
        </Button>
      </form>
      <div className="mt-4">
        <Button
          onClick={handleToggle}
          className="w-full py-2 bg-[#2D2F36] hover:bg-[#41444F] text-white"
        >
          {isLogin ? "Go to Registration" : "Go to Login"}
        </Button>
      </div>
      {statusMessage && (
        <div className="mt-4 p-4 bg-[#2D2F36] rounded">
          <p>{statusMessage}</p>
        </div>
      )}
    </Card>
  );
};

export default AuthenticationPage;
