import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connect from "./service/rabbit";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));
app.use(express.json({ limit: "40kb" }));
app.use(cookieParser());

connect();

import adminRoutes from "./routes/admin.routes";

app.use("/", adminRoutes);

export default app;
