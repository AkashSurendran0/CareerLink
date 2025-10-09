import { Container } from "inversify";
import { TYPES } from "./types";
import { CompanyController } from "./interfaces/controllers/CompanyController";
import { AddCompany } from "./application/user-cases/AddCompany";
import { CompanyRepository } from "./infrastructure/repositories/CompanyRepository";
import { CheckCompanyRegistrationInfo } from "./application/user-cases/CheckCompanyRegistrationInfo";
import { GetCompanyDetails } from "./application/user-cases/GetCompanyDetails";
import { EditCompany } from "./application/user-cases/EditCompany";
import { GetAllCompanies } from "./application/user-cases/GetAllCompanies";
import { AlterCompanyStatus } from "./application/user-cases/AlterCompanyStatus";

const container=new Container()

container.bind(TYPES.ICompanyRepository).to(CompanyRepository).inSingletonScope()

container.bind(TYPES.IAddCompany).to(AddCompany).inSingletonScope()
container.bind(TYPES.ICheckCompanyRegistrationInfo).to(CheckCompanyRegistrationInfo).inSingletonScope()
container.bind(TYPES.IGetCompanyDetails).to(GetCompanyDetails).inSingletonScope()
container.bind(TYPES.IEditCompany).to(EditCompany).inSingletonScope()
container.bind(TYPES.IGetAllCompanies).to(GetAllCompanies).inSingletonScope()
container.bind(TYPES.IAlterCompanyStatus).to(AlterCompanyStatus).inSingletonScope()

container.bind<CompanyController>(TYPES.CompanyController).to(CompanyController)

export default container