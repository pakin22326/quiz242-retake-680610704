import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { type CustomRequest, type UserPayload, type User } from "../libs/types.js";
import { users } from "../db/db.ts";

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
        try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    // ตรวจสอบ Token
    const jwt_secret = process.env.JWT_SECRET || "default_secret";

    const payload = jwt.verify(token, jwt_secret) as UserPayload;

    const user = users.find(
      (u: User) => u.username === payload.username
    );

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    if (!user.tokens || !user.tokens.includes(token)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    req.user = payload;
    req.token = token;

    // ให้ request ทำงานต่อ
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }
};

