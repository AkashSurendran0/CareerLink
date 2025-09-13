import express from 'express'
import dotenv from 'dotenv'
import AuthRouter from './routes/authRoutes'
import { connectDB } from './infrastructure/database/Sequelize'

const app = express()
dotenv.config()

connectDB()
app.use(express.json())

app.use('/', AuthRouter)

app.listen(5001, ()=>{
    console.log('User service running')
})