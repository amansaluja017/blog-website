import express from "express";
import { blogPost, getAllBlogs } from "../controller/blog.controller";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

router.route('/post').post(upload.fields([
    {
        name: 'coverImage',
        maxCount: 1,
    }
]), blogPost);

router.route('/getBlogs').get(getAllBlogs);

export default router;