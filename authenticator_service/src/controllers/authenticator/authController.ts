import { Request, Response, NextFunction } from "express";
import { loggerAuth } from "../../logger/logger";
import { pool } from "../../config/postgresClient";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET
// Sign-up function
const signUp = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    // Check if user already exists
    const userCheckResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password. Salt rounds could be set in .env
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, role]
    );

    const newUser = result.rows[0];

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
    loggerAuth.info(`User created successfully: ${username}`);
  } catch (error) {
    loggerAuth.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signIn = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    async (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string }
    ) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      try {
        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role }, // payload
          secret as string, // secret key
          { expiresIn: "7d" } // token expiration
        );

        // Send token to gateway instead of sessionId
        return res.status(200).json({
          message: "Sign-in successful",
          token,
        });
      } catch (error) {
        return res.status(500).json({ message: "Error during token generation" });
      }
    }
  )(req, res, next);
};


export { signUp, signIn };
