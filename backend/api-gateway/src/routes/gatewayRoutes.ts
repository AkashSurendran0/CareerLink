import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";
import { authMiddleware } from "../middleware/jwtVerifier";

const route=Router()
const gatewayController=new GatewayController()

route.use('/user', authMiddleware, gatewayController.getPath('/user'))
route.use('/admin', authMiddleware, gatewayController.getPath('/admin'))

export default route