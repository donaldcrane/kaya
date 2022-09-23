import { Router } from "express";
import AppiontmentController from "../controllers/appiontment";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";

import { validateBooking, validateId, validateUpdate } from "../validations/appiontment";

const router = Router();
const { verifyToken, verifyCustomer, verifyVendor } = Authentication;
const {
  bookAppiontment, getCustomerAppiontments, getAppiontmentsHistory, updateAppiontmentStatus
} = AppiontmentController;

router.post("/", verifyToken, verifyCustomer, validator(validateBooking), bookAppiontment);
router.get("/customer/:customerId", verifyToken, verifyVendor, validator(validateId), getCustomerAppiontments);
router.get("/history", verifyToken, verifyVendor, getAppiontmentsHistory);

router.patch("/:appiontmentId", verifyToken, verifyVendor, validator(validateUpdate), updateAppiontmentStatus);

export default router;
