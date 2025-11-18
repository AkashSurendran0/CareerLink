import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { JobController } from "../interface/controllers/JobController";

const router=Router()
const jobController=container.get<JobController>(TYPES.JobController)

router.post('/addJob', jobController.addJob)
router.get('/getAllJobs', jobController.getAllJobs)
router.get('/getJobDetails', jobController.getJobDetails)
router.patch('/editJob', jobController.editJob)
router.patch('/closeJob', jobController.closeJobApplication)
router.get('/getAvailableJobs', jobController.getAvailableJobs)
router.post('/applyJobWithUrl', jobController.applyJobWithUrl)

export default router