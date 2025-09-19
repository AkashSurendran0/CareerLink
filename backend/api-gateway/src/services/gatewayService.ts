import {createProxyMiddleware} from 'http-proxy-middleware'
import { RequestHandler } from 'express'

export class GatewayService {
    private routes:{[key:string]:string}

    constructor(){
        this.routes={
            '/user':'http://localhost:5001',
            '/admin':'http://localhost:5002'
        }
    }

    getProxy(path:string): RequestHandler{
        const target=this.routes[path]
        if(!target){
            throw new Error(`No target confirmed for path ${path}`)
        }

        return createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: (pathReq:string) => pathReq.replace(path, '')
        })
    }
}