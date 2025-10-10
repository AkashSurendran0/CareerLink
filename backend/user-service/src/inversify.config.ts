import { Container } from "inversify";
import { TYPES } from "./types";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { UserDetailsRepository } from "./infrastructure/repositories/UserDetailsRepository";
import { LoginUser } from "./application/use-cases/LoginUser";
import { SignupUser } from "./application/use-cases/SignupUser";
import { AddUserDetails } from "./application/use-cases/AddUserDetails";
import { AlterUserStatus } from "./application/use-cases/AlterUserStatus";
import { ChangePass } from "./application/use-cases/ChangePass";
import { CheckUserBlock } from "./application/use-cases/CheckUserBlock";
import { EditUserDetails } from "./application/use-cases/EditUserDetails";
import { GetUserDetails } from "./application/use-cases/GetUserDetails";
import { GetAllUsers } from "./application/use-cases/GetUsers";
import { GoogleLogin } from "./application/use-cases/GoogleLogin";
import { UserController } from "./interfaces/controllers/UserController";
import { UserDetailsController } from "./interfaces/controllers/UserDetailsController";
import { SendOTP } from "./application/use-cases/SignupUser";
import { SendResetOTP } from "./application/use-cases/ChangePass";
import { Mailer } from "./utils/MailHelper";
import { VerifyOTP } from "./application/use-cases/VerifyOTP";

const container = new Container();

container.bind(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.IUserDetailsRepository).to(UserDetailsRepository).inSingletonScope();

container.bind(TYPES.ILoginUser).to(LoginUser).inSingletonScope();
container.bind(TYPES.ISignupUser).to(SignupUser).inSingletonScope();
container.bind(TYPES.IAddUserDetails).to(AddUserDetails).inSingletonScope();
container.bind(TYPES.IAlterUserStatus).to(AlterUserStatus).inSingletonScope();
container.bind(TYPES.IChangePass).to(ChangePass).inSingletonScope();
container.bind(TYPES.ICheckUserBlock).to(CheckUserBlock).inSingletonScope();
container.bind(TYPES.IEditUserDetails).to(EditUserDetails).inSingletonScope();
container.bind(TYPES.IGetUserDetails).to(GetUserDetails).inSingletonScope();
container.bind(TYPES.IGetAllUsers).to(GetAllUsers).inSingletonScope();
container.bind(TYPES.IGoogleLogin).to(GoogleLogin).inSingletonScope();
container.bind(TYPES.ISendOTP).to(SendOTP).inSingletonScope();
container.bind(TYPES.ISendResetOtp).to(SendResetOTP).inSingletonScope();
container.bind(TYPES.Mailer).to(Mailer).inSingletonScope();
container.bind(TYPES.IVerifyOTP).to(VerifyOTP).inSingletonScope();

container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserDetailsController>(TYPES.UserDetailsController).to(UserDetailsController);

export default container; 