import { Router } from "express";
import userRoutes from "./user";
import messageRoutes from "./message";
import appiontmentRoutes from "./appiontment";
import shopRoutes from "./shop";
import channelRoutes from "./channel";

const router = Router();

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/appiontments", appiontmentRoutes);
router.use("/shops", shopRoutes);
router.use("/channels", channelRoutes);

export default router;
