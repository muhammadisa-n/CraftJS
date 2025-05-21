import nodemailer from "nodemailer";
import { logger } from "../config/logger";
import { env } from "../config/env";

let transporter;

const isMailConfigComplete =
  env.MAIL_HOST!.trim() !== "" &&
  env.MAIL_PORT!.trim() !== "" &&
  env.MAIL_USER!.trim() !== "" &&
  env.MAIL_PASS!.trim() !== "";

if (isMailConfigComplete) {
  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      logger.error("❌ Failed Connect To Nodemailer", error);
    } else {
      logger.info("✅ Connected To Nodemailer", success);
    }
  });
} else {
  logger.warn("⚠️ Nodemailer config is incomplete, skipping mail setup");
}

export default transporter;
