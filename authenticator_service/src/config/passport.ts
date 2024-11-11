import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { loggerAuth } from "../logger/logger";
import { pool } from "./postgresClient";
import bcrypt from 'bcrypt';

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        // Fetch user from the database
        const result = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        const user = result.rows[0];

        if (!user) {
          loggerAuth.warn(
            `Invalid username in local strategy for user: ${username}`
          );
          return done(null, false, {
            message: "Invalid username or password!",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          loggerAuth.warn(
            `Invalid password in local strategy for user: ${username}`
          );
          return done(null, false, {
            message: "Invalid username or password!",
          });
        }

        // If credentials are valid, return the user object
        return done(null, user);
      } catch (error) {
        loggerAuth.error(`Error in local strategy for user: ${username}`, error);
        return done(error);
      }
    }
  )
);

// Serialize user to store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to fetch user object from the user ID stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

export { passport, pool };
