import { Container } from "inversify";
import { JobController } from "./interface/controllers/JobController";
import { TYPES } from "./types";
import { AddJob } from "./application/use-case/AddJob";
import { JobRepository } from "./infrastructure/repository/JobRepository";
import { GetAllJobs } from "./application/use-case/GetAllJobs";
import { GetJobDetails } from "./application/use-case/GetJobDetails";
import { EditJob } from "./application/use-case/EditJob";
import { CloseJobApplication } from "./application/use-case/CloseJobApplication";
import { GetAvailableJobs } from "./application/use-case/GetAvailableJobs";
import { ApplyJob } from "./application/use-case/ApplyJobWithUrl";
import { JobApplicationsRepository } from "./infrastructure/repository/JobApplicationsRepository";
import { GetUserAppliedJobs } from "./application/use-case/GetUserAppliedJobs";
import { GetJobApplicants } from "./application/use-case/GetJobApplicants";
import { AlterUserApplication } from "./application/use-case/AlterJobApplication";

const container=new Container()

container.bind(TYPES.IJobRepository).to(JobRepository).inSingletonScope()
container.bind(TYPES.IJobApplicationsRepository).to(JobApplicationsRepository).inSingletonScope()

container.bind(TYPES.IAddJob).to(AddJob).inSingletonScope()
container.bind(TYPES.IGetAllJobs).to(GetAllJobs).inSingletonScope()
container.bind(TYPES.IGetJobDetails).to(GetJobDetails).inSingletonScope()
container.bind(TYPES.IEditJob).to(EditJob).inSingletonScope()
container.bind(TYPES.ICloseJobApplication).to(CloseJobApplication).inSingletonScope()
container.bind(TYPES.IGetAvailableJobs).to(GetAvailableJobs).inSingletonScope()
container.bind(TYPES.IApplyJob).to(ApplyJob).inSingletonScope()
container.bind(TYPES.IGetUserAppliedJobs).to(GetUserAppliedJobs).inSingletonScope()
container.bind(TYPES.IGetJobApplicants).to(GetJobApplicants).inSingletonScope()
container.bind(TYPES.IAlterUserApplication).to(AlterUserApplication).inSingletonScope()

container.bind<JobController>(TYPES.JobController).to(JobController)

export default container