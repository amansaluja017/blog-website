import express from "express";
import { blogPost, deleteBlog, getAllBlogs, myBlogs, updateBlog } from "../controller/blog.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.use(verifyJWT);

router.route('/post').post(upload.fields([
    {
        name: 'coverImage',
        maxCount: 1,
    }
]), blogPost);

router.route('/getBlogs').get(getAllBlogs);
router.route('/getMyBlogs').get(myBlogs);
router.route('/update-blog/:blogId').patch(upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    }
]) , updateBlog);
router.route('/delete-blog/:blogId').delete(deleteBlog);

export default router;