import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.lib.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app =express();
import authRoutes from "./routes/auth.route.js";
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);


const PORT=process.env.PORT;


app.listen(PORT,()=>{
    console.log("server is running on port "+ PORT);
    connectDB();
})