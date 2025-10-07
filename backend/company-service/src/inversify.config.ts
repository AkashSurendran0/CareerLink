import { Container } from "inversify";
import { TYPES } from "./types";
import { CompanyController } from "./interfaces/controllers/CompanyController";
import { AddCompany } from "./application/user-cases/AddCompany";
import { CompanyRepository } from "./infrastructure/repositories/CompanyRepository";
import { CheckCompanyRegistrationInfo } from "./application/user-cases/CheckCompanyRegistrationInfo";
import { GetCompanyDetails } from "./application/user-cases/GetCompanyDetails";

const container=new Container()

container.bind(TYPES.ICompanyRepository).to(CompanyRepository).inSingletonScope()

container.bind<AddCompany>(TYPES.AddCompany).to(AddCompany)
container.bind<CheckCompanyRegistrationInfo>(TYPES.CheckCompanyRegistrationInfo).to(CheckCompanyRegistrationInfo)
container.bind<GetCompanyDetails>(TYPES.GetCompanyDetails).to(GetCompanyDetails)

container.bind<CompanyController>(TYPES.CompanyController).to(CompanyController)

export default container