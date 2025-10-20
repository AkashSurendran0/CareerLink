import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";
import { authMiddleware, adminAuthMiddleware } from "../middleware/jwtVerifier";

const route=Router()
const gatewayController=new GatewayController()

route.use('/user', authMiddleware, gatewayController.getPath('/user'))
route.use('/admin', adminAuthMiddleware, gatewayController.getPath('/admin'))
route.use('/company', authMiddleware, gatewayController.getPath('/company'))
route.use('/notification', authMiddleware, gatewayController.getPath('/notification'))

export default route