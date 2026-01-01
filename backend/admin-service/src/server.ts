import express from 'express'
import AdminRouter from './routes/AdminRoute'
import { connectDB } from './infrastructure/database/Sequelize'
import dotenv from 'dotenv'
import { logger } from './utils/logger'

dotenv.config()

const app=express()
connectDB()

app.use(express.json())
app.use('/v1', AdminRouter)

app.listen(5002, ()=>{
    logger.info('Admin service is running')
})  