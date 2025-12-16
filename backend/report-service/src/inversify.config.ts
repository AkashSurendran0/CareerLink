import { Container } from "inversify";
import { TYPES } from "./types";
import { ReportController } from "./controller/ReportController";
import { ReportUser } from "./services/ReportUser";
import { ReportRepository } from "./infrastructure/repository/ReportRepository";
import { ReportCompany } from "./services/ReportCompany";
import { GetPaginatedReports } from "./services/GetPaginatedReports";

const container=new Container()

container.bind(TYPES.IReportRepository).to(ReportRepository).inSingletonScope()

container.bind(TYPES.IReportUser).to(ReportUser).inSingletonScope()
container.bind(TYPES.IReportCompany).to(ReportCompany).inSingletonScope()
container.bind(TYPES.IGetPaginatedReports).to(GetPaginatedReports).inSingletonScope()

container.bind(TYPES.ReportController).to(ReportController).inSingletonScope()

export default container