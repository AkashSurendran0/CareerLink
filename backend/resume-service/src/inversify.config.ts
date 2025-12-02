import { Container } from "inversify";
import { TYPES } from "./types";
import { ResumeController } from "./controllers/ResumeController";
import { CreateResume } from "./services/CreateResume";
import { UploadResume } from "./services/UploadResume";
import { ResumeRepository } from "./infrastructure/respository/ResumeRespository";
import { GetAllUserResumes } from "./services/GetAllUserResumes";
import { CreateCoverLetter } from "./services/CreateCoverLetter";
import { CreateTailoredResume } from "./services/CreateTailoredResume";
import { CreateTailoredCoverLetter } from "./services/CreateTailoredCoverLetter";
import { CheckTailoredVersion } from "./services/CheckTailoredVersion";
import { CountRepository } from "./infrastructure/respository/CountRepository";
import { DeleteCount } from "./services/DeleteCount";
import { CheckNormalVersion } from "./services/CheckNormalVersion";

const container=new Container()

container.bind(TYPES.IResumeRepository).to(ResumeRepository).inSingletonScope()

container.bind(TYPES.ICreateResume).to(CreateResume).inSingletonScope()
container.bind(TYPES.IUploadResume).to(UploadResume).inSingletonScope()
container.bind(TYPES.IGetAllUserResumes).to(GetAllUserResumes).inSingletonScope()
container.bind(TYPES.ICreateCoverLetter).to(CreateCoverLetter).inSingletonScope()
container.bind(TYPES.ICreateTailoredResume).to(CreateTailoredResume).inSingletonScope()
container.bind(TYPES.ICreateTailoredCoverLetter).to(CreateTailoredCoverLetter).inSingletonScope()
container.bind(TYPES.ICheckTailoredVersion).to(CheckTailoredVersion).inSingletonScope()
container.bind(TYPES.ICountRepository).to(CountRepository).inSingletonScope()
container.bind(TYPES.IDeleteCount).to(DeleteCount).inSingletonScope()
container.bind(TYPES.ICheckNormalVersion).to(CheckNormalVersion).inSingletonScope()

container.bind(TYPES.ResumeController).to(ResumeController).inSingletonScope()

export default container