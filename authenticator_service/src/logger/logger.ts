import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const loggerAuth = createLogger({
  level: "http",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/auth.log" }), // Log to file
  ],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
});

const loggerTest = createLogger({
  level: "http",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/test.log" }), // Log to file
  ],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
});
export { loggerAuth, loggerTest };
