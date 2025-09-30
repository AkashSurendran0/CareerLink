import express from 'express'
import AdminRouter from './routes/AdminRoute'
import { connectDB } from './infrastructure/database/Sequelize'

const app=express()
connectDB()

app.use(express.json())
app.use('/', AdminRouter)

app.listen(5002, ()=>{
    console.log('Admin service is running')
}) 