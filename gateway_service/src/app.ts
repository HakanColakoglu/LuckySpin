import express from "express";
import morgan from "morgan";
import { loggerGateway } from "./logger/logger"; // Import the Winston logger
import dotenv from "dotenv";

// Import routes
import indexRoutes from "./routes/gateway/index";
import authRoutes from "./routes/gateway/authRoutes";

// Import Redis and PostgreSQL clients with named imports
import cookieParser from "cookie-parser";
import { connectRedis, closeRedis } from "./config/redisClient";
import { shutdownServices } from "./utils/gracefulShutdown";

import cors from 'cors';
import { corsOptions } from './config/corsOption'; 
import { limiter } from './config/rateLimit'; // Import the rate limiter

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => loggerGateway.http(message.trim()),
    },
  })
);

connectRedis();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(limiter);

// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);

// Only start the server if this module is the main module
// You don't have to do this but your tests might have issues otherwise.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  shutdownServices(server, {closeRedis});
}

export { app };
