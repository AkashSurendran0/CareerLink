import express from "express";
import dotenv from "dotenv";
import gatewayRoutes from "./routes/gatewayRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger";
import { Router } from "express";

dotenv.config();
const app=express();
const router=Router();

router.get("/health", (_req, res)=>{
    res.status(200).send("API Gateway is healthy");
});

app.use(cors({
    origin:true,
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser());

app.use((req, _res, next) => {
  logger.info(`[GATEWAY] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/", gatewayRoutes);
app.use(express.json());

app.listen(5000, ()=>{
    logger.info("Api-gateway is running at 5000 port");
});