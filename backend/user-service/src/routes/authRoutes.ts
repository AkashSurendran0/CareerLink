import { Router } from "express";
import { AuthController } from "../interfaces/controllers/AuthController";

const router=Router()
const authController=new AuthController()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/sendOTP', authController.sendOtp)

export default router