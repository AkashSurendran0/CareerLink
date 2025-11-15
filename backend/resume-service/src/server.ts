import express from 'express'
import ResumeRoutes from './routes/ResumeRoutes'
import { dbConnect } from './config/connectDb'

dbConnect()
const app=express()
app.use(express.json())

app.use('/v1', ResumeRoutes)

app.listen(5006, ()=>{
    console.log('Resume service is running')
})