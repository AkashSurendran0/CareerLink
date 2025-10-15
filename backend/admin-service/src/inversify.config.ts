import { Container } from "inversify";
import { TYPES } from "./types";
import { AdminRepository } from "./infrastructure/database/AdminRepository";
import { AdminLogin } from "./application/use-cases/AdminLogin";
import { AdminController } from "./interfaces/controllers/AdminController";

const container=new Container()

container.bind(TYPES.IAdminRepository).to(AdminRepository).inSingletonScope()

container.bind(TYPES.IAdminLogin).to(AdminLogin).inSingletonScope()

container.bind<AdminController>(TYPES.AdminController).to(AdminController)

export default container