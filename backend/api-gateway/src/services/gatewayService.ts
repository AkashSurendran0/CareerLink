import {createProxyMiddleware} from 'http-proxy-middleware'
import { RequestHandler } from 'express'
import dotenv from 'dotenv'

dotenv.config()

export class GatewayService {
    private _routes:{[key:string]:string}

    constructor(){
        this._routes={
            '/user':`${process.env.USER_SERVICE_ROUTE}`,
            '/admin':`${process.env.ADMIN_SERVICE_ROUTE}`,
            '/company':`${process.env.COMPANY_SERVICE_ROUTE}`,
            '/notification':`${process.env.NOTIFICATION_SERVICE_ROUTE}`,
            '/job':`${process.env.JOB_SERVICE_ROUTE}`,
            '/resume':`${process.env.RESUME_SERVICE_ROUTE}`,
        }
    }

    getProxy(path:string): RequestHandler{
        const target=this._routes[path]
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