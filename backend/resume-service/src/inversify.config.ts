import { Container } from "inversify";
import { TYPES } from "./types";
import { ResumeController } from "./controllers/ResumeController";
import { CreateResume } from "./services/CreateResume";

const container=new Container()

container.bind(TYPES.ICreateResume).to(CreateResume).inSingletonScope()

container.bind(TYPES.ResumeController).to(ResumeController).inSingletonScope()

export default container