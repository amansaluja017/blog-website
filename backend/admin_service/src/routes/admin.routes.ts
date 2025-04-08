import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyAdmin } from "../middleware/admin.middleware";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserBlock,
  loginAdmin,
} from "../controller/admin.controller";

const router = express.Router();

router.route("/login").post(loginAdmin);

router.use(verifyAdmin, verifyJWT);

router.route("/dashboard-stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId/toggle-block").patch(toggleUserBlock);

export default router;
