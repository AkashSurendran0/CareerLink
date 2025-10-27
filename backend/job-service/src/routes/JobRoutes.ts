import { Router } from "express";
import container from "../inversify.config";
import { TYPES } from "../types";
import { JobController } from "../interface/controllers/JobController";

const router=Router()
const jobController=container.get<JobController>(TYPES.JobController)

router.post('/addJob', jobController.addJob)
router.get('/getAllJobs', jobController.getAllJobs)

export default router