import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";
import { authMiddleware } from "../middleware/jwtVerifier";

const route=Router()
const gatewayController=new GatewayController()

route.use('/user', authMiddleware, gatewayController.getPath('/user'))
route.use('/admin', authMiddleware, gatewayController.getPath('/admin'))
route.use('/company', authMiddleware, gatewayController.getPath('/company'))
route.use('/notification', authMiddleware, gatewayController.getPath('/notification'))
route.use('/job', authMiddleware, gatewayController.getPath('/job'))
route.use('/resume', authMiddleware, gatewayController.getPath('/resume'))
route.use('/media', authMiddleware, gatewayController.getPath('/media'))
route.use('/subscription', authMiddleware, gatewayController.getPath('/subscription'))
route.use('/chat', authMiddleware, gatewayController.getPath('/chat'))

export default route