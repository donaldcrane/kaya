import { Router } from "express";
import messageController from "../controllers/messages";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";

import { validateChannel, validateChannelId } from "../validations/message";

const router = Router();
const {
  verifyToken, verifyVendor
} = Authentication;
const {
  createChannel, getPublicChannels, getMyChannels, getChannel, joinForum
} = messageController;

router.post("/", verifyToken, verifyVendor, validator(validateChannel), createChannel);

router.get("/public", verifyToken, getPublicChannels);
router.get("/me", verifyToken, getMyChannels);
router.get("/:channelId", verifyToken, validator(validateChannelId), getChannel);

router.patch("/:channelId", verifyToken, validator(validateChannelId), joinForum);

export default router;
