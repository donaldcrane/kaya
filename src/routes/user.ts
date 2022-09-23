import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";
import parser from "../middlewares/uploads";

import {
  validateSignup, validateLogin, validateProfile, validateUser
} from "../validations/user";

const router = Router();
const { verifyToken, verifyAdmin } = Authentication;
const {
  createUser, loginUser, getAllUsers, uploadProfilePicture, updateProfile, activateDeactivateUser
} = UserController;

router.post("/signin", validator(validateLogin), loginUser);
router.post("/signup", validator(validateSignup), createUser);

router.get("/", verifyToken, verifyAdmin, getAllUsers);

router.patch("/profile", verifyToken, validator(validateProfile), updateProfile);
router.patch("/picture", verifyToken, parser.single("image"), uploadProfilePicture);
router.patch("/:userId", verifyToken, verifyAdmin, validator(validateUser), activateDeactivateUser);

export default router;
