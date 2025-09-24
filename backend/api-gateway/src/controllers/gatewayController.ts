import { GatewayService } from "../services/gatewayService";

export class GatewayController {
    private _gatewayService:GatewayService

    constructor() {
        this._gatewayService = new GatewayService()
    }

    getPath(path:string){
        return this._gatewayService.getProxy(path)
    }

}