import { Request, Response } from "express";
import models from "../models";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import { IShopQuery } from "../utils/interface";

/**
 * @class ShopController
 * @description create, seller Shop
 * @exports ShopController
 */
export default class ShopController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createShop(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { name, address } = req.body;
      const shop = await models.Shop.create({ name, address, vendor: _id });
      return successResponse(res, 201, "shop created successfully.", shop);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getMyShops(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { page = 1, limit = 10, title } = req.query;
      const filters = {} as IShopQuery;
      if (title) {
        filters.$text = {
          $search: title as string
        };
      }
      filters.vendor = _id;
      const shops = await models.Shop.find(filters)
        .sort({ createdAt: 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(
        res,
        200,
        "Successfully retrieved all shops.",
        shops
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getMyShopLogs(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { shopId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const shops = await models.Log.find({ shop: shopId, vendor: _id })
        .sort({ createdAt: 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(
        res,
        200,
        "Successfully retrieved shop logs.",
        shops
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async viewAllShops(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, title } = req.query;
      const filters = {} as IShopQuery;
      if (title) {
        filters.$text = {
          $search: title as string
        };
      }
      const shops = await models.Shop.find(filters)
        .sort({ createdAt: 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(
        res,
        200,
        "Successfully retrieved all shops.",
        shops
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getShopById(req: Request, res: Response) {
    try {
      const { shopId } = req.params;
      const shop = await models.Shop.findById(shopId);
      if (!shop) { return errorResponse(res, 404, "Shop not found."); }
      return successResponse(res, 200, "Successfully retrieved shop.", shop);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }
}
