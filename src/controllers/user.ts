import { Request, Response } from "express";
import bcrypt from "bcrypt";
import models from "../models";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import jwtHelper from "../utils/jwt";
import { IUser, IFilter } from "../utils/interface";

const { generateToken } = jwtHelper;

/**
 * @class UserController
 * @description create, log in user
 * @exports UserController
 */
export default class UserController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createUser(req: Request, res: Response) {
    try {
      const {
        firstName, lastName, phone, email, password, role
      } = req.body;
      const emailExist = await models.User.findOne({ email });
      if (emailExist) {
        return errorResponse(res, 409, "email already registered by another user.");
      }
      const phoneExist = await models.User.findOne({ phone });
      if (phoneExist) {
        return errorResponse(res, 409, "phone number already used by another user.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await models.User.create({
        firstName, lastName, email, password: hashedPassword, phone, role
      });

      return successResponse(res, 201, "Account created successfully, kindly log in.");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user: IUser | null = await models.User.findOne({ email });
      if (!user) { return errorResponse(res, 404, "Email does not exist."); }
      if (!user.active) { return errorResponse(res, 403, "Account deactivated, Kindly contact Admin."); }
      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) { return errorResponse(res, 404, "Password is not correct!."); }
      const { _id, phone } = user;
      const token = await generateToken({ _id, email, phone });
      const userDetails = {
        _id, email, firstname: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, photo: user.photo
      };
      return successResponse(
        res,
        200,
        "User Logged in Successfully.",
        { token, userDetails }
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { _id } = req.user as IUser;
      const { firstName, lastName, location } = req.body;
      const user: IUser | null = await models.User.findByIdAndUpdate({ _id }, { firstName, lastName, location }, { new: true }).select("-password");
      return successResponse(
        res,
        200,
        "Profile updated Successfully.",
        user
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async uploadProfilePicture(req: Request, res: Response) {
    try {
      const { _id } = req.user as IUser;
      if (!req.file) { return errorResponse(res, 422, "Kindly uplaod an image."); }
      const user = await models.User.findByIdAndUpdate(
        _id,
        { photo: req.file?.path },
        { new: true }
      ).select("-password");

      return successResponse(res, 200, "Picture uploaded Successfully.", user);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { role, name } = req.query;
      const filter = {} as IFilter;
      if (role) {
        filter.role = role as string;
      }
      if (name) {
        filter.$text = {
          $search: name as string
        };
      }
      const users = await models.User.find(filter);
      return successResponse(
        res,
        200,
        "Users fetched Successfully.",
        { total: users.length, users }
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
      * @param {object} req - The reset request object
      * @param {object} res - The reset errorResponse object
      * @returns {object} Success message
      */
  static async activateDeactivateUser(req: Request, res: Response) {
    try {
      const { type } = req.query;
      const { userId } = req.params;
      const user = models.User.findById(userId);
      if (!user) { return errorResponse(res, 404, "User not found"); }
      let value;
      type === "activate" ? value = true : value = false;
      const userData = await models.User.findByIdAndUpdate(userId, { active: value }, { new: true });
      return successResponse(res, 200, "User active status updated.", userData);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
