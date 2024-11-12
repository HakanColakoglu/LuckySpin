import express from "express";
import morgan from "morgan";
import { loggerAuth } from "./logger/logger"; // Import the Winston logger
import dotenv from "dotenv";

// Import configurations
import { passport } from "./config/passport";
// Import routes
import authRoutes from "./routes/authenticator/authRoutes";

// Import Redis and PostgreSQL clients with named imports
import { connectPostgres, closePostgres } from "./config/postgresClient";
import { shutdownServices } from "./utils/gracefulShutdown";

import cors from 'cors';
import { corsOptions } from './config/corsOption'; 
import { limiter } from './config/rateLimit'; // Import the rate limiter

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 4000;

// Use Morgan to log HTTP requests using Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => loggerAuth.http(message.trim()), // Use 'http' log level for HTTP requests
    },
  })
);

// Initialize services
connectPostgres();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session must be initialized before passport!
app.use(passport.initialize());

app.use(cors(corsOptions));
app.use(limiter);

// Routes
app.use("/", authRoutes);

// Only start the server if this module is the main module
// You don't have to do this but your tests might have issues otherwise.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  shutdownServices(server, { closePostgres });
}

export { app };
