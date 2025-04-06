import express from "express";
import {
  blogPost,
  blogSeenBy,
  deleteBlog,
  getAllBlogs,
  getLikes,
  getViews,
  myBlogs,
  toogleLikedBlog,
  updateBlog,
} from "../controller/blog.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.use(verifyJWT);

router.route("/post").post(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  blogPost
);

router.route("/getBlogs").get(getAllBlogs);
router.route("/getMyBlogs").get(myBlogs);
router.route("/update-blog/:blogId").patch(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateBlog
);
router.route("/delete-blog/:blogId").delete(deleteBlog);
router.route("/like-blog/:blogId").post(toogleLikedBlog);
router.route("/get-likes/:blogId").get(getLikes);
router.route("/get-views/:blogId").get(getViews);
router.route("/blog-seen/:blogId").post(blogSeenBy);

export default router;
