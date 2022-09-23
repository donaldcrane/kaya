import { Request, Response } from "express";
import { errorResponse, successResponse, handleError } from "../utils/responses";
import models from "../models";

export default class messageController {
  static async createChannel(req: Request, res: Response) {
    try {
      const { name, type, appiontmentId } = req.body;
      const members = [req.user._id];
      if (type === "private") {
        const appiont = await models.Appiontment.findById(appiontmentId);
        if (!appiont) return errorResponse(res, 404, "appiontment not found");
        members.push(appiont.customer);
      }
      const channel = await models.Channel.create({
        name, type, members
      });
      return successResponse(res, 201, "Channel created successfully.", channel);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const {
        message, channelId
      } = req.body;
      const channel = await models.Channel.findOne({
        _id: channelId, members: _id,
      });
      if (!channel) {
        return errorResponse(res, 404, "Please join channel before you can send message.");
      }

      const messageData = {
        message, user: _id, channel: channelId
      };
      await models.Message.create(messageData);

      return successResponse(res, 201, "message sent");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async getPublicChannels(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const channels = await models.Channel.find({ type: "public" }).populate([
        { path: "members", select: "_id firstName lastName role photo", },
      ]).sort({ createdAt: 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(res, 200, "Channels fetched successfully.", channels);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async getMyChannels(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { _id } = req.user;
      const channels = await models.Channel.find({ members: _id }).populate([
        { path: "members", select: "_id firstName lastName role photo", },
      ]).sort({ createdAt: 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(res, 200, "Channels fetched successfully.", channels);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async getChannel(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const channel = await models.Channel.findById(channelId).populate([
        { path: "members", select: "_id firstName lastName role photo", },
      ]);
      if (!channel) return errorResponse(res, 400, "invalid channel");
      return successResponse(res, 200, "Channel fetched successfully.", channel);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const channel = await models.Channel.findById(channelId);
      if (!channel) return errorResponse(res, 404, "invalid channel");

      const chatMessages = await models.Message.find({ channel: channelId })
        .populate([
          { path: "channel", select: "_id name", },
          { path: "user", select: "_id firstName lastName role photo", },
        ])
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return successResponse(res, 200, "Messages retrieved successfully.", chatMessages);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  static async joinForum(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const { _id } = req.user;
      const findChannel = await models.Channel.findById(channelId);
      if (!findChannel) return errorResponse(res, 404, "invalid channel");
      if (findChannel.type === "private") return errorResponse(res, 403, "Cannot join channel");
      const inForum = await models.Channel.findOne({
        _id: channelId,
        members: _id,
      });
      if (inForum) return errorResponse(res, 409, "User already in channel");
      await models.Channel.updateOne(
        { _id: channelId },
        { $addToSet: { members: [_id] } }
      );

      const channel = await models.Channel.findById(channelId);

      return successResponse(res, 200, "Successfully joined forum.", channel);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }
}
