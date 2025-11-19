import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { JobController } from "../interface/controllers/JobController";
import multer from "multer";

const router=Router()
const jobController=container.get<JobController>(TYPES.JobController)
const upload=multer()

router.post('/addJob', jobController.addJob)
router.get('/getAllJobs', jobController.getAllJobs)
router.get('/getJobDetails', jobController.getJobDetails)
router.patch('/editJob', jobController.editJob)
router.patch('/closeJob', jobController.closeJobApplication)
router.get('/getAvailableJobs', jobController.getAvailableJobs)
router.post('/applyJobWithUrl', jobController.applyJobWithUrl)
router.post('/applyJobWithFile', upload.single('resume'), jobController.applyJobWithFile)
router.get('/getUserAppliedJobs', jobController.getUserAppliedJobs)
router.get('/getJobApplicants', jobController.getJobApplicants)

export default router