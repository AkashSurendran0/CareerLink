import { Router } from "express";
import { UserController } from "../interfaces/controllers/UserController";
import passport from "passport";

const router=Router()
const userController=new UserController()

router.post('/login', userController.login)
router.post('/signup', userController.signup)
router.post('/sendOTP', userController.sendOtp)
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
router.post('/changePassword', userController.changePassword)
router.post('/sendResetOTP', userController.sendPassResetOtp)
router.get('/getUsers', userController.getPageUsers)

export default router