import express from 'express'
import dotenv from 'dotenv'
import gatewayRoutes from './routes/gatewayRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
const app=express()

app.use(()=>{
  console.log('hi')
})

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}))
app.use(cookieParser())

app.use((req, res, next) => {
  console.log("Gateway saw request:", req.method, req.url);
  next();
});


app.use('/', gatewayRoutes)
app.use(express.json())

app.listen(5000, ()=>{
    console.log('Api-gateway is running at 5000')
})