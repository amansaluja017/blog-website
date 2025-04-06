import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connect from "./service/rabbit";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));
app.use(express.json({ limit: "40kb" }));

connect();

import userRoutes from "./routes/user.routes";

app.use("/", userRoutes);

export default app;
