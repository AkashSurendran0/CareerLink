import { GatewayService } from "../services/gatewayService";
import { logger } from "../utils/logger";

export class GatewayController {
    private _gatewayService:GatewayService

    constructor() {
        this._gatewayService = new GatewayService()
    }

    getPath(path:string){
        logger.info('PROXY FUNCTION HIT')
        return this._gatewayService.getProxy(path)
    }

}