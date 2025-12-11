import { Router } from "express";
import multer from "multer";
import { CompanyController } from "../interfaces/controllers/CompanyController";
import container from "../inversify.config";
import { TYPES } from "../types";

const router=Router()
const upload=multer()
const companyController=container.get<CompanyController>(TYPES.CompanyController)

router.post('/addCompany', upload.single("logo"), companyController.addCompany)
router.get('/getCompanyRegistrationInfo', companyController.getRegistrationInfo)
router.get('/getCompanyDetails', companyController.getCompanyInfo)
router.post('/editCompany', upload.single("logo"), companyController.editCompany)
router.get('/getApprovedCompanies', companyController.getApprovedCompanies)
router.get('/getPendingCompanies', companyController.getPendingCompanies)
router.patch('/alterCompanyStatus', companyController.changeCompanyStatus)
router.get('/checkCompanyDetails', companyController.checkCompanyDetails)
router.patch('/rejectCompany', companyController.rejectCompany)
router.patch('/acceptCompany', companyController.acceptCompany)
router.patch('/reapplyCompany', companyController.reapplyCompany)
router.delete('/deleteCompany', companyController.deleteCompany)
router.get('/getAvailableCompanies', companyController.getAvailableCompanies)
router.get('/getCompanyDetailsByQuery', companyController.getCompanyDetailsByQuery)

export default router;