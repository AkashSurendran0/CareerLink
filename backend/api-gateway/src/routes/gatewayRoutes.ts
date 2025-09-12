import { Router } from "express";
import { GatewayController } from "../controllers/gatewayController";

const route=Router()
const gatewayController=new GatewayController()

route.use('/user', gatewayController.getPath('/user'))

export default route