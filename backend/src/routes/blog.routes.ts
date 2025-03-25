import express from "express";
import { blogPost } from "../controller/blog.controller";

const router = express.Router();

router.route('/post').post(blogPost);

export default router;