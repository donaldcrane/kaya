import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responses";
import models from "../models";
import config from "../config";
import { IUser } from "../utils/interface";

/**
 * @class Authentication
 * @description authenticate token and roles
 * @exports Authentication
 */
export default class Authentication {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            const decoded: any = await jwt.verify(token, config.JWT_KEY as string);

            const user = await models.User.findById(decoded._id);
            if (!user) return errorResponse(res, 404, "User account not found");
            req.user = user;
            return next();
          }
        } else {
          return errorResponse(res, 401, "Invalid authorization format");
        }
      } else {
        return errorResponse(res, 401, "Authorization not found");
      }
    } catch (error: any) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.user as IUser;
      const admin = await models.User.findOne({ _id, role: "admin" });
      if (!admin) return errorResponse(res, 401, "Unauthorized access (admin protected route).");
      return next();
    } catch (error: any) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async verifyVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.user as IUser;
      const vendor = await models.User.findOne({
        _id,
        role: "vendor"
      });
      if (!vendor) return errorResponse(res, 401, "Unauthorized access (vendor protected route).");
      return next();
    } catch (error: any) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async verifyCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.user as IUser;
      const customer = await models.User.findOne({ _id, role: "customer" });
      if (!customer) return errorResponse(res, 401, "Unauthorized access (customer protected route).");
      return next();
    } catch (error: any) {
      return errorResponse(res, 500, error.message);
    }
  }
}
