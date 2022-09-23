import { Router } from "express";
import ShopController from "../controllers/shop";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";

import { validateShop, validateShopId } from "../validations/shop";

const router = Router();
const { verifyToken, verifyVendor } = Authentication;
const {
  createShop, getMyShops, getMyShopLogs, viewAllShops, getShopById
} = ShopController;

router.post("/", verifyToken, verifyVendor, validator(validateShop), createShop);

router.get("/", verifyToken, viewAllShops);
router.get("/vendor", verifyToken, verifyVendor, getMyShops);
router.get("/:shopId/logs", verifyToken, verifyVendor, validator(validateShopId), getMyShopLogs);
router.get("/:shopId", verifyToken, validator(validateShopId), getShopById);

export default router;
