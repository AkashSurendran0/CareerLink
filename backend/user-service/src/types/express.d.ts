import { UserDTO } from "../dto/UserDTO";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDTO;
  }
}

