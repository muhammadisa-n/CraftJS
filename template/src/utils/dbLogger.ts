import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const dbLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "database-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxFiles: "30d",
      maxSize: "10m",
    }),
  ],
});
