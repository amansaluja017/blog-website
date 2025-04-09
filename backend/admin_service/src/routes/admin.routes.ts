import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyAdmin } from "../middleware/admin.middleware";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  toggleUserBlock,
  loginAdmin,
  updateAdmin,
  updatePassword,
  getAdmin,
  followers,
} from "../controller/admin.controller";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();


router.use(verifyJWT);
router.route("/login").post(loginAdmin);

router.use(verifyAdmin, verifyJWT);

router.route("/getCurrentUser").get(getAdmin);
router.route("/update-details").patch(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  }
]), updateAdmin);
router.route("/followers/:userId").post(followers);
router.route("/update-password").patch(updatePassword);
router.route("/dashboard-stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId/toggle-block").patch(toggleUserBlock);

export default router;
