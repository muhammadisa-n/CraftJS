import { NextFunction, Request, Response } from "express";
import { loginRequest, CreateUserRequest } from "../request/user-request";
import { successResponse, successUpdateResponse } from "../response/response";

import dotenv from "dotenv";
import { AuthService } from "../services/auth-service";
import { UpdateUserRequest } from "../request/user-request";
import { UserRequest } from "../utils/type-request";
dotenv.config();
export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await AuthService.register(request);
      res.status(201).json(successResponse("Register Berhasil", 201, response));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: loginRequest = req.body as loginRequest;
      const response = await AuthService.login(request);
      res.cookie("auth_refresh_token", response.refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.status(200).json(
        successResponse("Login Berhasil", 200, {
          user: response.user,
          accessToken: response.accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async me(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.me(req.user!);
      res
        .status(200)
        .json(successResponse("Get Detail User Berhasil", 200, response));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await AuthService.updateProfile(req.user!, request);
      res.status(200).json(successUpdateResponse(response));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    await AuthService.logout(req);
    res.clearCookie("auth_refresh_token");
    res.status(200).json(successResponse("Logout berhasil", 200));
  }
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.refreshToken(req);
      res.status(200).json(
        successResponse("Get Access Token Berhasil", 200, {
          user: response.user,
          accessToken: response.accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
