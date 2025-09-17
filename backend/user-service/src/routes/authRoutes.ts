import { Router } from "express";
import { AuthController } from "../interfaces/controllers/AuthController";
import passport from "passport";

const router=Router()
const authController=new AuthController()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/sendOTP', authController.sendOtp)
router.get(
    '/google', 
    passport.authenticate('google', {scope:['profile', 'email']})
)
router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect:'/login'}),
    (req, res)=>{
        res.redirect('http://localhost:3000/feed')
    }
)

export default router