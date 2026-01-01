import express from 'express'
import { dbConnect } from './infrastructure/database/Mongoose'
import JobRoutes from './routes/JobRoutes'
import cookieParser from 'cookie-parser'
import { rabbitmqService } from './utils/Rabbitmq'
import { logger } from './utils/logger'

const app=express()
dbConnect()

app.use(express.json())
app.use(cookieParser())
rabbitmqService.connect()

  
app.use('/v1', JobRoutes)

app.listen(5005, ()=>{
    logger.info('Job service is running')
})