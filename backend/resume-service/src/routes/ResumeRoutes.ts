import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { ResumeController } from "../controllers/ResumeController";

const resumeController=container.get<ResumeController>(TYPES.ResumeController)
const router=Router()

router.post('/createResume', resumeController.createResume)

export default router