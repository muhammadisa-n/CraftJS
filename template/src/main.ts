import { web } from "./application/web";
import { logger } from "./application/logging";
import "dotenv/config";
import { connectDatabase } from "./application/database";
import dotenv from "dotenv";
dotenv.config();
if (
  !process.env.JWT_SECRET_ACCESS_TOKEN ||
  process.env.JWT_SECRET_ACCESS_TOKEN.trim() === "" ||
  !process.env.JWT_SECRET_REFRESH_TOKEN ||
  process.env.JWT_SECRET_REFRESH_TOKEN.trim() === ""
) {
  console.error(
    "❌ JWT_SECRET_ACCESS_TOKEN or JWT_SECRET_REFRESH_TOKEN is missing in your .env file."
  );
  console.error("👉 Please run `npm run craft key:generate` to create them.");
  process.exit(1);
}

connectDatabase();

const PORT = process.env.PORT || 3000;
const BASEURL = process.env.BASE_URL || `http://localhost:${PORT}`;
web.listen(process.env.PORT, () => {
  logger.info(`🚀 Server is listening on: ${BASEURL}`);
  logger.info(`🔗 API Docs available at: ${BASEURL}/api/docs`);
});
