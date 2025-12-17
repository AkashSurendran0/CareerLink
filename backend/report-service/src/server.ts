import express from 'express'
import { connectPSQL } from './infrastructure/database/Sequelize'
import ReportRouter from './routes/ReportRoutes'

const app=express()
connectPSQL()

app.use(express.json())

app.use('/v1', ReportRouter)

app.listen(5010, ()=>{
    console.log('Report service running')
})