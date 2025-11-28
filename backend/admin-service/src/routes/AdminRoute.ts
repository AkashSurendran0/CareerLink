import { Router } from 'express'
import { AdminController } from '../interfaces/controllers/AdminController'
import container from '../inversify.config'
import { TYPES } from '../types'

const router=Router()
const adminController=container.get<AdminController>(TYPES.AdminController)

router.post('/login', adminController.adminLoginCase)
router.get('/checkAdmin', adminController.checkAdmin)

export default router