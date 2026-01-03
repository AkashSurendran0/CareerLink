import express from 'express'
import dotenv from 'dotenv'
import gatewayRoutes from './routes/gatewayRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { logger } from './utils/logger'

dotenv.config()
const app=express()

app.use(cors({
    origin:true,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}))
app.options('*', cors())
app.use(cookieParser())

app.use((req, _res, next) => {
  logger.info(`[GATEWAY] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', gatewayRoutes)
app.use(express.json())

app.listen(5000, ()=>{
    logger.info('Api-gateway is running at 5000 port')
})