import { GatewayService } from "../services/gatewayService";

export class GatewayController {
    private gatewayService:GatewayService

    constructor() {
        this.gatewayService = new GatewayService()
    }

    getPath(path:string){
        return this.gatewayService.getProxy(path)
    }

}