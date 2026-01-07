import express from "express";
import { connectPSQL } from "./infrastructure/database/Sequelize";
import ReportRouter from "./routes/ReportRoutes";
import { logger } from "./utils/logger";

const app=express();
connectPSQL();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", ReportRouter);

app.listen(5010, ()=>{
    logger.info("Report service running");
});