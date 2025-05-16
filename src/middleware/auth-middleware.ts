import { NextFunction, Response } from "express";
import { errorResponse } from "../response/response";
import { prismaClient } from "../application/database";

import jwt from "jsonwebtoken";
import { UserRequest } from "../utils/type-request";
import { ResponseError } from "../response/response-error";
export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(errorResponse("Unauthorized: Access Token Tidak Valid.", 401));
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS_TOKEN as string
    ) as {
      id: string;
      email: string;
      fullname: string;
    };
  } catch (err) {
    throw new ResponseError(401, "Unauthorized: Access Token Tidak Valid.");
  }
  const user = await prismaClient.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    return res
      .status(401)
      .json(errorResponse("Unauthorized: Anda belum login", 401));
  }
  req.user = user;
  next();
};
