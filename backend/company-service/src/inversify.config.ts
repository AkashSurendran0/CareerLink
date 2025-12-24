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
import { CheckCompanyDetails } from "./application/user-cases/CheckCompanyDetails";
import { AlterCompanyRegistrationStatus } from "./application/user-cases/AlterCompanyRegistrationStatus";
import { ReapplyCompany } from "./application/user-cases/ReapplyCompany";
import { DeleteCompany } from "./application/user-cases/DeleteCompany";
import { GetAvailableCompanies } from "./application/user-cases/GetAvailableCompanies";
import { GetCompanyDetailsByQuery } from "./application/user-cases/GetCompanyDetailsByQuery";
import { GetActiveCompanyCount } from "./application/user-cases/GetActiveCompanyCount";

const container=new Container()

container.bind(TYPES.ICompanyRepository).to(CompanyRepository).inSingletonScope()

container.bind(TYPES.IAddCompany).to(AddCompany).inSingletonScope()
container.bind(TYPES.ICheckCompanyRegistrationInfo).to(CheckCompanyRegistrationInfo).inSingletonScope()
container.bind(TYPES.IGetCompanyDetails).to(GetCompanyDetails).inSingletonScope()
container.bind(TYPES.IEditCompany).to(EditCompany).inSingletonScope()
container.bind(TYPES.IGetAllCompanies).to(GetAllCompanies).inSingletonScope()
container.bind(TYPES.IAlterCompanyStatus).to(AlterCompanyStatus).inSingletonScope()
container.bind(TYPES.ICheckCompanyDetails).to(CheckCompanyDetails).inSingletonScope()
container.bind(TYPES.IAlterCompanyRegistrationStatus).to(AlterCompanyRegistrationStatus).inSingletonScope()
container.bind(TYPES.IReapplyCompany).to(ReapplyCompany).inSingletonScope()
container.bind(TYPES.IDeleteCompany).to(DeleteCompany).inSingletonScope()
container.bind(TYPES.IGetAvailableCompanies).to(GetAvailableCompanies).inSingletonScope()
container.bind(TYPES.IGetCompanyDetailsByQuery).to(GetCompanyDetailsByQuery).inSingletonScope()
container.bind(TYPES.IGetActiveCompanyCount).to(GetActiveCompanyCount).inSingletonScope()

container.bind<CompanyController>(TYPES.CompanyController).to(CompanyController)

export default container