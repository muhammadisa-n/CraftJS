import winston from "winston";
import chalk from "chalk";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message, null, 2) : message;

  let coloredLevel = level.toUpperCase();

  switch (level) {
    case "error":
      coloredLevel = chalk.redBright.bold(level.toUpperCase());
      break;
    case "warn":
      coloredLevel = chalk.yellowBright.bold(level.toUpperCase());
      break;
    case "info":
      coloredLevel = chalk.greenBright.bold(level.toUpperCase());
      break;
    case "debug":
      coloredLevel = chalk.bgBlueBright.bold(level.toUpperCase());
      break;
    default:
      coloredLevel = chalk.bgBlueBright.bold(level.toUpperCase());
      break;
  }

  return `[${chalk.gray(timestamp)}] ${coloredLevel} - ${formattedMessage}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [new winston.transports.Console()],
});
