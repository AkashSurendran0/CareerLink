import { GatewayService } from "../services/gatewayService";

export class GatewayController {
    private _gatewayService:GatewayService

    constructor() {
        this._gatewayService = new GatewayService()
    }

    getPath(path:string){
        console.log('PROXY FUNCTION HIT')
        return this._gatewayService.getProxy(path)
    }

}