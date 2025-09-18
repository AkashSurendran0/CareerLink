import express from 'express'
import dotenv from 'dotenv'
import AuthRouter from './routes/UserRoutes'
import { connectDB } from './infrastructure/database/Sequelize'
import passport from 'passport'
import session from 'express-session'
import './config/passport'

const app = express()
dotenv.config()

connectDB()
app.use(session({
    secret: 'batman',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

app.use('/', AuthRouter)

app.listen(5001, ()=>{
    console.log('User service running')
})