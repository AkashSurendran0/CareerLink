import express from 'express'
import dotenv from 'dotenv'
import gatewayRoutes from './routes/gatewayRoutes'
import cors from 'cors'

dotenv.config()
const app=express()

app.use(cors({
    origin:'http://localhost:3000'
}))

app.use((req, res, next) => {
  console.log("Gateway saw request:", req.method, req.url);
  next();
});


app.use('/', gatewayRoutes)
app.use(express.json())

app.listen(5000, ()=>{
    console.log('Api-gateway is running at 5000')
})