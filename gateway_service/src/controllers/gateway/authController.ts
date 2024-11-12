import { Request, Response } from "express";
import { loggerGateway } from "../../logger/logger";
import { pool } from "../../config/postgresClient";
import jwt from "jsonwebtoken";
import { redisClient } from "../../config/redisClient";
import axios from "axios";

const AUTHENTICATOR_URL = process.env.AUTHENTICATOR_URL;

const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const response = await axios.post(`${AUTHENTICATOR_URL}/signup`, {
      username,
      password,
      role,
    });

    // If user already exists, then no need to attempt
    if (response.status == 201 && response.data && response.data.user) {
      const userId = response.data.user.id;

      // Create initial user_balance record
      await pool.query(
        "INSERT INTO user_balance (user_id, balance) VALUES ($1, $2)",
        [userId, 0] // Start with a balance of 0
      );

      // Create initial balance_history record
      await pool.query(
        "INSERT INTO balance_history (user_id, amount, type) VALUES ($1, $2, $3)",
        [userId, 0, "deposit"] // Initial deposit entry with 0 amount
      );

      loggerGateway.info(`User balance and history created for user ID: ${userId}`);
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      loggerGateway.error("Error during signup request to authenticator:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
  
    loggerGateway.error("Unexpected error during signup request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const response = await axios.post(`${AUTHENTICATOR_URL}/signin`, {
      username,
      password,
    });

    const token = response.data.token;
    // For development purposes, false allows http requests, otherwise only https requests.
    res.cookie("token", token, { httpOnly: true, secure: false });

    return res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    loggerGateway.error("Error during sign-in request to authenticator:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (decoded && decoded.exp) {
      const exp = decoded.exp;

      await redisClient.set(`blacklist:${token}`, "true", {
        EX: exp - Math.floor(Date.now() / 1000),
      });

      res.clearCookie("token", { httpOnly: true, secure: false });
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    loggerGateway.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { signUp, signIn, logout };
