import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";
import { authMiddleware } from "../middleware/jwtVerifier";

const route=Router();
const gatewayController=new GatewayController();

route.use("/api/user", authMiddleware, gatewayController.getPath("/user"));
route.use("/api/admin", authMiddleware, gatewayController.getPath("/admin"));
route.use("/api/company", authMiddleware, gatewayController.getPath("/company"));
route.use("/api/notification", authMiddleware, gatewayController.getPath("/notification"));
route.use("/api/job", authMiddleware, gatewayController.getPath("/job"));
route.use("/api/resume", authMiddleware, gatewayController.getPath("/resume"));
route.use("/api/media", authMiddleware, gatewayController.getPath("/media"));
route.use("/api/subscription", authMiddleware, gatewayController.getPath("/subscription"));
route.use("/api/chat", authMiddleware, gatewayController.getPath("/chat"));
route.use("/api/report", authMiddleware, gatewayController.getPath("/report"));

export default route;