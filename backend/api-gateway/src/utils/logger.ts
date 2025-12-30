import winston from "winston";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // 🔹 Info & request logs
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info"
    }),

    // 🔹 Error-only logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error"
    })
  ]
});

export default logger;
