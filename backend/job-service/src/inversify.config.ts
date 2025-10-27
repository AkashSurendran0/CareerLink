import { Container } from "inversify";
import { JobController } from "./interface/controllers/JobController";
import { TYPES } from "./types";
import { AddJob } from "./application/use-case/AddJob";
import { JobRepository } from "./infrastructure/repository/JobRepository";
import { GetAllJobs } from "./application/use-case/GetAllJobs";
import { GetJobDetails } from "./application/use-case/GetJobDetails";
import { EditJob } from "./application/use-case/EditJob";

const container=new Container()

container.bind(TYPES.IJobRepository).to(JobRepository).inSingletonScope()

container.bind(TYPES.IAddJob).to(AddJob).inSingletonScope()
container.bind(TYPES.IGetAllJobs).to(GetAllJobs).inSingletonScope()
container.bind(TYPES.IGetJobDetails).to(GetJobDetails).inSingletonScope()
container.bind(TYPES.IEditJob).to(EditJob).inSingletonScope()

container.bind<JobController>(TYPES.JobController).to(JobController)

export default container