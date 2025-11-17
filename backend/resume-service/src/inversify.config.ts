import { Container } from "inversify";
import { TYPES } from "./types";
import { ResumeController } from "./controllers/ResumeController";
import { CreateResume } from "./services/CreateResume";
import { UploadResume } from "./services/UploadResume";
import { ResumeRepository } from "./infrastructure/respository/ResumeRespository";
import { GetAllUserResumes } from "./services/GetAllUserResumes";
import { CreateCoverLetter } from "./services/CreateCoverLetter";

const container=new Container()

container.bind(TYPES.IResumeRepository).to(ResumeRepository).inSingletonScope()

container.bind(TYPES.ICreateResume).to(CreateResume).inSingletonScope()
container.bind(TYPES.IUploadResume).to(UploadResume).inSingletonScope()
container.bind(TYPES.IGetAllUserResumes).to(GetAllUserResumes).inSingletonScope()
container.bind(TYPES.ICreateCoverLetter).to(CreateCoverLetter).inSingletonScope()

container.bind(TYPES.ResumeController).to(ResumeController).inSingletonScope()

export default container