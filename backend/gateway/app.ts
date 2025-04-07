import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expressProxy from "express-http-proxy";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/user', expressProxy(process.env.USER_SERVICE_URL!));
app.use('/blog', expressProxy(process.env.BLOG_SERVICE_URL!));
app.use('/comment', expressProxy(process.env.COMMENT_SERVICE_URL!));


export default app;