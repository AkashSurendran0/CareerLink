import express from 'express'
import { dbConnect } from './config/connectDb'
import PostRoutes from './routes/PostRoutes'

const app=express()

dbConnect()
app.use(express.json())

// app.use(()=>{
//     console.log('here')
// })

app.use('/v1', PostRoutes)

app.listen(5007, ()=>{
    console.log('Post service running')
})