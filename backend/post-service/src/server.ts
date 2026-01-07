import express from "express";
import { dbConnect } from "./config/connectDb";
import PostRoutes from "./routes/PostRoutes";
import { logger } from "./utils/logger";

const app=express();

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", PostRoutes);

app.listen(5007, ()=>{
    logger.info("Post service running");
});