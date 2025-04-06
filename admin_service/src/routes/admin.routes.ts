import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyAdmin } from "../middleware/admin.middleware";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserBlock,
} from "../controller/admin.controller";

const router = express.Router();

router.use(verifyJWT, verifyAdmin);

router.route("/dashboard-stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId/toggle-block").patch(toggleUserBlock);

export default router;
