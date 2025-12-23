import { Container } from "inversify";
import { TYPES } from "./types";
import { ReportController } from "./controller/ReportController";
import { ReportUser } from "./services/ReportUser";
import { ReportRepository } from "./infrastructure/repository/ReportRepository";
import { ReportCompany } from "./services/ReportCompany";
import { GetPaginatedReports } from "./services/GetPaginatedReports";
import { GetPreviousUserReports } from "./services/GetPreviousReports";
import { GetReportDetails } from "./services/GetReportDetails";
import { CloseReport } from "./services/CloseReport";
import { ReportMessage } from "./services/ReportMessage";
import { GetReportAnalyics } from "./services/GetReportAnalytics";

const container=new Container()

container.bind(TYPES.IReportRepository).to(ReportRepository).inSingletonScope()

container.bind(TYPES.IReportUser).to(ReportUser).inSingletonScope()
container.bind(TYPES.IReportCompany).to(ReportCompany).inSingletonScope()
container.bind(TYPES.IGetPaginatedReports).to(GetPaginatedReports).inSingletonScope()
container.bind(TYPES.IGetPreviousUserReports).to(GetPreviousUserReports).inSingletonScope()
container.bind(TYPES.IGetReportDetails).to(GetReportDetails).inSingletonScope()
container.bind(TYPES.ICloseReport).to(CloseReport).inSingletonScope()
container.bind(TYPES.IReportMessage).to(ReportMessage).inSingletonScope()
container.bind(TYPES.IGetReportAnalytics).to(GetReportAnalyics).inSingletonScope()

container.bind(TYPES.ReportController).to(ReportController).inSingletonScope()

export default container