import express from 'express'
import dotenv from 'dotenv'
import gatewayRoutes from './routes/gatewayRoutes'

dotenv.config()
const app=express()

app.use(express.json())

app.use('/', gatewayRoutes)

app.listen(5000, ()=>{
    console.log('Api-gateway is running at 5000')
})