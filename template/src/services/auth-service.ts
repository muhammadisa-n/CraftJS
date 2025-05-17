import { loginRequest, CreateUserRequest } from "../request/user-request";
import {
  toUserDetailResponse,
  toUserResponse,
  UserDetailResponse,
  UserResponse,
} from "../response/user-response";
import { ResponseError } from "../utils/response-error";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import * as argon2 from "argon2";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { hashToken } from "../utils/hash";
import { UpdateUserRequest } from "../request/user-request";
import { UserRepository } from "../repository/user-repository";
import { UserRequest } from "../utils/type-request";
import dotenv from "dotenv";
dotenv.config();
export class AuthService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const data = Validation.validate(UserValidation.REGISTER, request);
    const emailExits = await UserRepository.countByEmail(data.email);

    if (emailExits != 0) {
      throw new ResponseError(409, "Akun Sudah Terdaftar!");
    }

    data.password = await argon2.hash(data.password);

    const response = await UserRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
    return toUserResponse(response);
  }

  static async login(request: loginRequest) {
    const data = Validation.validate(UserValidation.LOGIN, request);
    const userExits = await UserRepository.findUserByEmail(data.email);

    if (!userExits) {
      throw new ResponseError(401, "Gagal Login! Detail login salah");
    }

    const isPasswordValid = await argon2.verify(
      userExits.password,
      data.password
    );
    if (!isPasswordValid) {
      throw new ResponseError(401, "Gagal Login! Detail login salah");
    }

    const refreshToken = jwt.sign(
      {
        id: userExits.id,
        fullname: userExits.fullName,
        email: userExits.email,
      },
      process.env.JWT_SECRET_REFRESH_TOKEN as string,
      {
        expiresIn: "1d",
      }
    );
    const hashedToken = hashToken.hash(refreshToken);
    await UserRepository.createRefreshToken({
      user_id: userExits.id,
      token: hashedToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const accessToken = jwt.sign(
      {
        id: userExits.id,
        fullname: userExits.fullName,
        email: userExits.email,
      },
      process.env.JWT_SECRET_ACCESS_TOKEN as string,
      {
        expiresIn: "5m",
      }
    );

    const user = toUserResponse(userExits);
    return { user, refreshToken, accessToken };
  }

  static async me(user: User): Promise<UserDetailResponse> {
    return toUserDetailResponse(user);
  }

  static async updateProfile(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const data = Validation.validate(UserValidation.UPDATE, request);
    if (data.fullName) {
      user.fullName = data.fullName;
    }
    if (data.password) {
      user.password = await argon2.hash(data.password);
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await UserRepository.findemailExistsNotUserLoggedIn(
        data.email,
        user.id
      );
      if (emailExists != 0) {
        throw new ResponseError(409, "Email Sudah Ada");
      }
      user.email = data.email;
    }
    const result = await UserRepository.updateUser(
      {
        fullName: user.fullName,
        password: user.password,
        email: user.email,
      },
      user.id
    );
    return toUserResponse(result);
  }

  static async logout(req: UserRequest) {
    const refreshToken = req.cookies.auth_refresh_token;
    if (!req.user) {
      throw new ResponseError(401, "Unauthorized: Anda Belum Login.");
    }
    if (!refreshToken) {
      throw new ResponseError(401, "Unauthorized: Anda Belum Login.");
    }
    const hashedToken = hashToken.hash(refreshToken);
    const authrefreshToken =
      await UserRepository.findRefreshTokenByUserAndToken(
        req.user.id,
        hashedToken
      );
    if (!authrefreshToken) {
      throw new ResponseError(
        401,
        "Unauthorized: Refresh Token Tidak Ditemukan"
      );
    }
    await UserRepository.deleteRefreshTokenByToken(authrefreshToken.token);
  }

  static async refreshToken(req: Request) {
    const refreshToken = req.cookies.auth_refresh_token;
    if (!refreshToken) {
      throw new ResponseError(401, "Unauthorized, Anda Belum Login");
    }
    const hashedToken = hashToken.hash(refreshToken);
    const existingToken =
      await UserRepository.findRefreshTokenWithUser(hashedToken);
    if (!existingToken) {
      throw new ResponseError(401, "Unauthorized,  Tidak Valid");
    }
    let decoded: any;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_REFRESH_TOKEN as string
      );
    } catch (err) {
      throw new ResponseError(401, "Token Tidak Valid Atau Kadaluarsa");
    }
    if (existingToken.expires_at < new Date()) {
      throw new ResponseError(401, "Token Sudah Kadaluarsa");
    }
    const payload = {
      id: existingToken.user.id,
      fullName: existingToken.user.fullName,
      email: existingToken.user.email,
    };
    const user = existingToken.user;
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS_TOKEN as string,
      {
        expiresIn: "10m",
      }
    );
    return { accessToken, user };
  }
}
