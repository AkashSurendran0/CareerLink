import { Container } from "inversify";
import { TYPES } from "./types";
import { CompanyController } from "./interfaces/controllers/CompanyController";
import { AddCompany } from "./application/user-cases/AddCompany";
import { ICompanyRepository } from "./domain/repositories/ICompanyRepository";
import { CompanyRepository } from "./infrastructure/repositories/CompanyRepository";

const container=new Container()

container.bind(TYPES.ICompanyRepository).to(CompanyRepository).inSingletonScope()

container.bind<AddCompany>(TYPES.AddCompany).to(AddCompany)

container.bind<CompanyController>(TYPES.CompanyController).to(CompanyController)

export default container