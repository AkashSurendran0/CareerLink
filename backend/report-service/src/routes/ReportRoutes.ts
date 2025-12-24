import { Router } from "express";
import container from "../inversify.config";
import { ReportController } from "../controller/ReportController";
import { TYPES } from "../types";

const router=Router()
const reportController=container.get<ReportController>(TYPES.ReportController)

router.post('/reportUser', reportController.reportUser)
router.post('/reportCompany', reportController.reportCompany)
router.get('/getPaginatedReports', reportController.getPaginatedReports)
router.get('/getPreviousUserReports', reportController.getPreviousUserReports)
router.get('/getReportDetails', reportController.getReportDetails)
router.patch('/closeReport', reportController.closeReport)
router.post('/reportMessage', reportController.reportMessage)
router.get('/getReportAnalytics', reportController.getReportAnalytics)
router.get('/getTodayReportCount', reportController.getTodayReportCount)

export default router