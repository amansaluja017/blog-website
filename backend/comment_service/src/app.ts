import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connect from "./service/rabbit";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect();

import commentRoutes from "./routes/comment.routes";

app.use("/", commentRoutes);

export default app;
