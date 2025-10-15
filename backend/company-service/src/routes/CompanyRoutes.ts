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
router.get('/getCompanies', companyController.getAllCompanies)
router.patch('/alterCompanyStatus', companyController.changeCompanyStatus)
router.get('/checkCompanyDetails', companyController.checkCompanyDetails)
router.patch('/alterCompanyRegistrationStatus', companyController.alterCompanyRegistrationStatus)
router.patch('/reapplyCompany', companyController.reapplyCompany)
router.delete('/deleteCompany', companyController.deleteCompany)

export default router;