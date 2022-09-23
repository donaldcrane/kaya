import { Request, Response } from "express";
import models from "../models";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import { IAppQuery } from "../utils/interface";

/**
 * @class AppiontmentController
 * @description create, seller Appiontment
 * @exports AppiontmentController
 */
export default class AppiontmentController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async bookAppiontment(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { shopId, day, time } = req.body;
      const shop = await models.Shop.findById(shopId);

      if (!shop) {
        return errorResponse(res, 404, "Shop not found.");
      }
      const createAppiontment = await models.Appiontment.create({
        shop: shopId, vendor: shop.vendor, customer: _id, day, time
      });
      const message = "Appiontment created.";
      await models.Log.create({
        message, appiontment: createAppiontment._id, shop: shopId, vendor: shop.vendor, customer: _id
      });
      return successResponse(res, 201, "Appiontment created successfully", createAppiontment);
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
  static async getCustomerAppiontments(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { customerId } = req.params;
      const appiontment = await models.Appiontment.find({ customer: customerId, vendor: _id }).populate([
        { path: "customer", select: "_id firstName lastName role photo", },
        { path: "vendor", select: "_id firstName lastName role photo", },
        { path: "shop", select: "_id name", },
      ]);
      if (!appiontment) { return errorResponse(res, 404, "User does not exist kindly create one."); }
      return successResponse(
        res,
        200,
        "Successfully retrieved customer Appiontment.",
        appiontment
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
  static async getAppiontmentsHistory(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { status } = req.query;
      let filter = {} as IAppQuery;
      if (status) {
        filter.status = status as string;
      }
      filter.vendor = _id;
      const appiontment = await models.Appiontment.find(filter).populate([
        { path: "customer", select: "_id firstName lastName role photo", },
        { path: "vendor", select: "_id firstName lastName role photo", },
        { path: "shop", select: "_id name", },
      ]).sort({ createdAt: 1 });
      if (!appiontment) { return errorResponse(res, 404, "User does not exist kindly create one."); }
      return successResponse(
        res,
        200,
        "Successfully retrieved appiontment history.",
        appiontment
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
  static async updateAppiontmentStatus(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { status } = req.query;
      const { reason } = req.body;
      const { appiontmentId } = req.params;
      const appiontment = await models.Appiontment.findOne({ _id: appiontmentId, vendor: _id });
      if (!appiontment) { return errorResponse(res, 404, "Appiontment does not exist."); }
      if (reason) {
        await models.Appiontment.findByIdAndUpdate(appiontmentId, { reason });
      }
      const updateAppiontment = await models.Appiontment.findByIdAndUpdate(appiontmentId, { status }, { new: true });
      const { shop, vendor, customer } = appiontment;
      const message = `Appiontment ${status}.`;
      await models.Log.create({
        message, appiontment: appiontment._id, shop, vendor, customer
      });
      return successResponse(
        res,
        200,
        "Successfully updated Appiontment.",
        updateAppiontment
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }
}
