import { Router } from 'express'
import { AdminController } from '../interfaces/controllers/AdminController'

const router=Router()
const adminController=new AdminController()

router.post('/login', adminController.adminLoginCase)

export default router