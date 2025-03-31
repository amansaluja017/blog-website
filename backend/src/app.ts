import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import path from 'path';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cookieParser());

dotenv.config();


app.use(cors({
    origin: [process.env.CORS_ORIGIN! , "https://1rt9brcw-5173.inc1.devtunnels.ms/"],
    credentials: true,
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true, limit: "40kb"}));
app.use(express.json({limit: "40kb"}));

import userRouter from "./routes/user.routes";
import blogRouter from "./routes/blog.routes"

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);

export { app };