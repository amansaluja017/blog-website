import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import path from 'path';


const app = express();

dotenv.config();


app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://localhost:5173",
    credentials: true,
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true, limit: "40kb"}));
app.use(express.json({limit: "40kb"}));


export { app };