import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";

const route=Router()
const gatewayController=new GatewayController()

route.use('/user', gatewayController.getPath('/user'))
route.use('/admin', gatewayController.getPath('/admin'))

export default route