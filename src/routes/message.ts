import { Router } from "express";
import messageController from "../controllers/messages";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";

import { validateMessage, validateChannelId } from "../validations/message";

const router = Router();
const { verifyToken } = Authentication;
const { sendMessage, getMessages } = messageController;

router.post("/", verifyToken, validator(validateMessage), sendMessage);

router.get("/channels/:channelId", verifyToken, validator(validateChannelId), getMessages);

export default router;
