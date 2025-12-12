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

const app = express();
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
app.use("/v1", V1UserRouter);

server.listen(5001, ()=>{
    console.log("User service running");
});     