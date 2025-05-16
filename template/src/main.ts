import { web } from "./application/web";
import { logger } from "./application/logging";
import "dotenv/config";
import { connectDatabase } from "./application/database";
connectDatabase();
web.listen(process.env.PORT, () => {
  logger.info(
    `Server Listening  On:${process.env.BASE_URL} Port: ${process.env.PORT}`
  );
  logger.info(`Server Listening Port:  ${process.env.PORT}`);
});
