import express from "express";
import { blogPost, getAllBlogs } from "../controller/blog.controller";
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

export default router;