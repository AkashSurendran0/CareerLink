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

export default router;