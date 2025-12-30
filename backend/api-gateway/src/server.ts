import express from 'express'
import dotenv from 'dotenv'
import gatewayRoutes from './routes/gatewayRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import logger from './utils/logger'
import { Request, Response, NextFunction } from 'express'

dotenv.config()
const app=express()

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}))
app.use(cookieParser())

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
);

app.use((req, res, next) => {
  logger.info(`Gateway received: ${req.method} ${req.url}`);
  next();
});


app.use('/', gatewayRoutes)
app.use(express.json())

app.use((err, req:Request, res:Response, next:NextFunction) => {
  logger.error('Unhandled error', {
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack
  });

  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(5000, ()=>{
    console.log('Api-gateway is running at 5000')
})