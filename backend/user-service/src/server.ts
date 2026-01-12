import express from "express";
import dotenv from "dotenv";
import V1UserRouter from "./routes/UserRoutes";
import { connectDB } from "./infrastructure/database/Sequelize";
import passport from "passport";
import session from "express-session";
import "./config/passport";
import { dbConnect } from "./infrastructure/database/Mongoose";
import "reflect-metadata";
import { rabbitmqService } from "./utils/Rabbitmq";
import { initUserSocket } from "./utils/Socket";
import http from "http";
import { logger } from "./utils/logger";
import Router from "express";  

const app = express();
const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).send("User service is healthy");
}); 

app.use(router);

const server=http.createServer(app);
initUserSocket(server);
dotenv.config();
connectDB();
dbConnect();  
app.use(session({ 
    secret: "batman",
    resave: false, 
    saveUninitialized: false 
})); 
(async () => {
rabbitmqService.connect();
})();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", V1UserRouter);

server.listen(5001, ()=>{
    logger.info("User service running");
});     