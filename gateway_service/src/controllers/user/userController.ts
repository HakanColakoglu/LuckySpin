import { pool } from "../../config/postgresClient";
import { Request, Response } from "express";
import { loggerGateway } from "../../logger/logger";

export const getUserBalance = async (userId: number) => {
  try {
    const result = await pool.query(
      "SELECT balance FROM user_balance WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("Balance not found for this user");
    }

    return parseInt(result.rows[0].balance, 10);
  } catch (error) {
    loggerGateway.error("Error fetching user balance:", error);
    throw new Error("Internal Server Error");
  }
};

export const getUserBalanceHistory = async (userId: number) => {
  try {
    const result = await pool.query(
      "SELECT date, amount, type FROM balance_history WHERE user_id = $1 ORDER BY date DESC",
      [userId]
    );

    if (result.rows.length === 0) {
      return []; // Return an empty array if no history found
    }

    return result.rows; // Returns an array of history entries
  } catch (error) {
    loggerGateway.error("Error fetching user balance history:", error);
    throw new Error("Internal Server Error");
  }
};

export const updateUserBalance = async (userId: number, newBalance: number, amount: number, type: string) => {
    try {
      await pool.query(
        "UPDATE user_balance SET balance = $1 WHERE user_id = $2",
        [newBalance, userId]
      );
  
      // Log transaction in balance history
      await pool.query(
        "INSERT INTO balance_history (user_id, date, amount, type) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)",
        [userId, amount, type]
      );
    } catch (error) {
      throw new Error("Error updating balance");
    }
  };