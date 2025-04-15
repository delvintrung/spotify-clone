import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  buyPremiumSuccess,
  getAllUsers,
  getMessages,
  getUserByUserId,
} from "../controller/user.controller.js";
const router = Router();

router.get("/", getAllUsers);
router.get("/check-premium", getUserByUserId);

router.get("/messages/:userId", protectRoute, getMessages);
router.post("/buy-premium", buyPremiumSuccess);

export default router;
