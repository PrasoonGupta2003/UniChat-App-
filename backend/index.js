import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app,server } from "./socket/socket.js";

const port=3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({
    origin: " http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter);

server.listen(port, () => {
    connectDb();
    console.log(`App listening to port ${port}`);
})