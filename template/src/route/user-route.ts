import express from "express";
import { UserController } from "../controller/user-controller";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth-middleware";

export const userRouter = express.Router();

// User
userRouter.post(
  "/api/services/users",
  asyncHandler(authMiddleware),
  UserController.create
);

userRouter.get(
  "/api/services/users",
  asyncHandler(authMiddleware),
  UserController.getAll
);
userRouter.get(
  "/api/services/users/:id",
  asyncHandler(authMiddleware),
  UserController.getOne
);

userRouter.put(
  "/api/services/users/:id",
  asyncHandler(authMiddleware),
  UserController.update
);

userRouter.delete(
  "/api/services/users/:id",
  asyncHandler(authMiddleware),
  UserController.delete
);
