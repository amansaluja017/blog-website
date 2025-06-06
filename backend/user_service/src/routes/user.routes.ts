import express, { Router } from "express";
import {
  getCurrentUser,
  googleUser,
  login,
  logout,
  updateDetails,
  updatePassword,
  userRegister,
  setPassword,
  verifyEmail,
  verifyOtp,
  checkUser,
  createPassword,
  followers,
} from "../controller/user.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router: Router = express.Router();

router.route("/register").post(userRegister);
router.route("/googleLogin").post(googleUser);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/login").post(login);
router.route("/update-details").patch(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateDetails
);
router.route("/update-password").patch(verifyJWT, updatePassword);
router.route("/set-password").patch(verifyJWT, setPassword);
router.route("/email-verify").get(verifyJWT, verifyEmail);
router.route("/verify-otp").post(verifyJWT, verifyOtp);
router.route("/check-user").post(checkUser);
router.route("/create-password").patch(createPassword);
router.route("/followers/:userId").post(verifyJWT, followers);

export default router;
