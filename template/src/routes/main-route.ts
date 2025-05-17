import express from "express";
import { successResponse } from "../response/response";
import { authRouter } from "./auth-route";
import { userRouter } from "./user-route";

export const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res
    .status(200)
    .json(successResponse(`${process.env.APP_NAME} is running`, 200))
    .end();
});
mainRouter.get("/api", (req, res) => {
  res
    .status(200)
    .json(successResponse(`${process.env.APP_NAME} api is running`, 200))
    .end();
});
mainRouter.use(authRouter);
mainRouter.use(userRouter);
