import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";
import { DateTime } from "luxon";
import dotenv from "dotenv";
dotenv.config();
export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});
prismaClient.$use(async (params, next) => {
  const result = await next(params);

  const convertToJakarta = (date: unknown): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    return DateTime.fromJSDate(date)
      .setZone(process.env.TZ)
      .toFormat(process.env.DATETIME_FORMAT as string);
  };

  const transformDates = (item: any): any => {
    if (!item) return item;

    if (Array.isArray(item)) {
      return item.map(transformDates);
    }

    if (typeof item === "object") {
      const newItem: any = { ...item };
      for (const key in newItem) {
        const value = newItem[key];
        if (
          ["created_at", "updated_at", "deleted_at"].includes(key) &&
          value instanceof Date
        ) {
          newItem[key] = convertToJakarta(value);
        } else if (typeof value === "object" && value !== null) {
          newItem[key] = transformDates(value); // recursive
        }
      }
      return newItem;
    }

    return item;
  };

  return transformDates(result);
});

prismaClient.$on("query", (e) => {
  logger.info(e);
});
prismaClient.$on("warn", (e) => {
  logger.warn(e);
});
prismaClient.$on("info", (e) => {
  logger.info(e);
});
prismaClient.$on("error", (e) => {
  logger.error(e);
});
export const connectDatabase = async () => {
  try {
    await prismaClient.$connect();
    logger.info("Connected Database");
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error Connect Database");
    } else {
      logger.error("Unknown error occurred:");
    }
  }
};
