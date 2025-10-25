import { Container } from "inversify";
import { JobController } from "./interface/controllers/JobController";
import { TYPES } from "./types";
import { AddJob } from "./application/use-case/AddJob";
import { JobRepository } from "./infrastructure/repository/JobRepository";

const container=new Container()

container.bind(TYPES.IJobRepository).to(JobRepository).inSingletonScope()

container.bind(TYPES.IAddJob).to(AddJob).inSingletonScope()

container.bind<JobController>(TYPES.JobController).to(JobController)

export default container