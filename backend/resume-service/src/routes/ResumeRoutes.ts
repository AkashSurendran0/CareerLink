import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { ResumeController } from "../controllers/ResumeController";
import multer from 'multer'

const resumeController=container.get<ResumeController>(TYPES.ResumeController)
const router=Router()
const upload=multer()

router.post('/createResume', resumeController.createResume)
router.post('/saveResume', upload.single('resume'), resumeController.saveResume)
router.get('/getAllUserResumes', resumeController.getAllUserResumes)
router.post('/createCoverLetter', resumeController.createCoverLetter)
router.post('/getTailoredResume', resumeController.getTailoredResume)

export default router