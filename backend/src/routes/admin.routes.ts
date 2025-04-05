import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/admin.middleware";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserBlock,
} from "../controller/admin.controller";

const router = express.Router();

// All routes are protected by JWT and admin middleware
router.use(verifyJWT, verifyAdmin);

router.route("/dashboard-stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId/toggle-block").patch(toggleUserBlock);

export default router;