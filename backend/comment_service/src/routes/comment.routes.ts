import express from "express";
import {
  deleteComment,
  editComment,
  getAllComments,
  postComment,
} from "../controller/comments.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = express.Router();
router.use(verifyJWT);

router.route("/post-comment/:blogId").post(postComment);
router.route("/get-comments/:blogId").get(getAllComments);
router.route("/edit-comment/:commentId").patch(editComment);
router.route("/delete-comment/:commentId").delete(deleteComment);

export default router;
